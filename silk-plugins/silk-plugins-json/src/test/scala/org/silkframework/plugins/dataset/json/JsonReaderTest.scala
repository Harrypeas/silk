/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.silkframework.plugins.dataset.json

import org.scalatest.{FlatSpec, Matchers}
import org.silkframework.entity.paths.UntypedPath
import org.silkframework.runtime.resource.ClasspathResourceLoader


class JsonReaderTest extends FlatSpec with Matchers {

  private val exampleJson = json("example.json")

  private lazy val persons = exampleJson.select("persons" :: Nil)

  private lazy val phoneNumbers = exampleJson.select("persons" :: "phoneNumbers" :: Nil)

  "On example.json, JsonReader" should "return 2 persons" in {
    persons.size should equal (2)
  }

  it should "return both person names" in {
    evaluate(persons, "name") should equal (Seq("John", "Max"))
  }

  it should "return all three numbers" in {
    evaluate(persons, "phoneNumbers/number") should equal (Seq("123", "456", "789"))
  }

  it should "return both home numbers" in {
    evaluate(persons, """phoneNumbers[type = "home"]/number""") should equal (Seq("123", "789"))
  }

  it should "support backward paths" in {
    evaluate(phoneNumbers, "\\phoneNumbers/id") should equal (Seq("0", "0", "1"))
  }

  it should "support keys with spaces" in {
    val example2Json = json("example2.json")
    val valuesWithSpaces = example2Json.select("values+with+spaces" :: Nil)
    evaluate(valuesWithSpaces, "space+value") should equal (Seq("Berlin", "Hamburg"))
  }

  it should "allow retrieving ids and texts from array values" in {
    val example = json("exampleArrays.json")
    val arrayItems = example.select("data" :: Nil)
    evaluate(arrayItems, "#id") should equal (Seq("65", "66"))
    evaluate(arrayItems, "#text") should equal (Seq("A", "B"))
  }

  private def evaluate(values: Seq[JsonTraverser], path: String): Seq[String] = {
    values.flatMap(value => value.evaluate(UntypedPath.parse(path).asStringTypedPath))
  }

  private def json(fileName: String) = {
    val resources = ClasspathResourceLoader("org/silkframework/plugins/dataset/json")
    JsonTraverser("alibi_task_id", resources.get(fileName))
  }
}