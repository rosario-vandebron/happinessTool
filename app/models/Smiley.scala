package models

import java.time.LocalDateTime

import play.api.libs.json.Json

case class Smiley(rate: Double, created: LocalDateTime)

object Smiley {
  implicit val formatter = Json.format[Smiley]
}
