package controllers

import java.time.LocalDateTime
import javax.inject._

import models.{Happiness, Smiley}
import play.api.libs.iteratee.{Concurrent, Iteratee}
import play.api.libs.json._
import play.api.mvc._
import play.modules.reactivemongo._
import reactivemongo.api.ReadPreference
import reactivemongo.play.json.collection._
import play.modules.reactivemongo.json._

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SmileyController @Inject()(val reactiveMongoApi: ReactiveMongoApi)(implicit exec: ExecutionContext) extends Controller with MongoController with ReactiveMongoComponents {

  def smileyFuture: Future[JSONCollection] = database.map(_.collection[JSONCollection]("smiley"))

  import Smiley.formatter

  def create(level: Double) = Action.async {
    for {
      collection <- smileyFuture
      result <- collection.insert(Smiley(level, LocalDateTime.now))
    } yield
      Ok("Mongo: %s".format(result))
  }

  def all = Action.async {
    for {
      result <- fetch
    } yield {
      Ok(Json.toJson(result))
    }
  }

  def fetch: Future[Happiness] = {
    val query = Json.obj("level" -> Json.obj("$gte" -> 0))
    val futureSmiliesList: Future[Seq[Smiley]] = smileyFuture.flatMap {
      _.find(query).
        cursor[Smiley](ReadPreference.primary).
        collect[List]()
    }

    // everything's ok! Let's reply with a JsValue
    futureSmiliesList.map { rates =>
      val length = rates.length
      val avg = length match {
        case 0 => -1
        case _ => rates.map { r => r.level }.sum / length
      }

      models.Happiness(avg)
    }
  }

  val (out, channel) = Concurrent.broadcast[String]
  def ws = WebSocket.using[String] { request =>
    val in = Iteratee.foreach[String] {
      msg =>
        for {
          collection <- {println(s"Receiving $msg")
             smileyFuture}
          _ <- collection.insert(Smiley(msg.toDouble, LocalDateTime.now))
          result <- fetch
        } yield {
          println(result)
          val msg = Json.toJson(result).toString()
          channel push msg
        }
    }
    (in,out)
  }

}


