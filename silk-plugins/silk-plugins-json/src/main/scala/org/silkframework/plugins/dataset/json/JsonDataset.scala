package org.silkframework.plugins.dataset.json

import org.silkframework.dataset._
import org.silkframework.runtime.activity.UserContext
import org.silkframework.runtime.plugin.annotations.{Param, Plugin}
import org.silkframework.runtime.resource.Resource

import scala.io.Codec

@Plugin(
  id = "json",
  label = "JSON",
  categories = Array(DatasetCategories.file),
  description = """Read from or write to a JSON file.""",
  documentationFile = "JsonDatasetDocumentation.md"
)
case class JsonDataset(
  @Param("Json file.")
  file: Resource,
  @Param(value = "The path to the elements to be read, starting from the root element, e.g., '/Persons/Person'. If left empty, all direct children of the root element will be read.", advanced = true)
  basePath: String = "",
  @deprecated("This will be removed in the next release.", "")
  @Param(label = "URI pattern (deprecated)", value = "A URI pattern, e.g., http://namespace.org/{ID}, where {path} may contain relative paths to elements", advanced = true)
  uriPattern: String = "") extends Dataset with ResourceBasedDataset {

  override def source(implicit userContext: UserContext): DataSource = JsonSource(file, basePath, uriPattern)

  override def linkSink(implicit userContext: UserContext): LinkSink = throw new NotImplementedError("JSON files cannot be written at the moment")

  override def entitySink(implicit userContext: UserContext): EntitySink = throw new NotImplementedError("JSON files cannot be written at the moment")
}
