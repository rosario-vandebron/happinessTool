package models

import java.time.LocalDateTime

import play.api.libs.json.Json

case class Smiley(level: Double, created: LocalDateTime)

object Smiley {
  implicit val formatter = Json.format[Smiley]
}

case class Happiness(level: Double)

object Happiness {
  implicit val formatter = Json.format[Happiness]
}
