package org.silkframework.dataset

import org.silkframework.entity.{Entity, EntitySchema, Path}
import org.silkframework.runtime.validation.ValidationException
import org.silkframework.util.Uri

/**
  * A data source on [[org.silkframework.entity.Entity]] objects
  */
case class EntityDatasource(entities: Traversable[Entity], entitySchema: EntitySchema) extends DataSource with PeakDataSource {
  override def retrieve(requestSchema: EntitySchema, limit: Option[Int]): Traversable[Entity] = {
    if(requestSchema.typeUri != entitySchema.typeUri) {
      throw new ValidationException("Type URI '" + requestSchema.typeUri.toString + "' not available!")
    } else {
      val matchingPaths = entitySchema.typedPaths.map(_.path).zipWithIndex.filter { case (path, _) =>
          requestSchema.typedPaths.exists(_.path == path)
      }
      val matchingPathMap = matchingPaths.toMap
      if(matchingPaths.size != requestSchema.typedPaths.size) {
        val missingPath = requestSchema.typedPaths.find(tp => !matchingPathMap.contains(tp.path))
        throw new ValidationException("Some requested paths do not exist in data source, e.g. " + missingPath.get.path.serializeSimplified + "!")
      } else {
        val matchingPathMap = matchingPaths.toMap
        val valuesIndexes = requestSchema.typedPaths.map ( tp => matchingPathMap(tp.path) )
        entities.map { entity =>
          new Entity(
            entity.uri,
            valuesIndexes map { idx => entity.values(idx) },
            requestSchema
          )
        }
      }
    }
  }

  override def retrieveByUri(entitySchema: EntitySchema, entities: Seq[Uri]): Seq[Entity] = {
    throw new RuntimeException("Retrieve by URI is not supported!")
  }

  override def retrieveTypes(limit: Option[Int]): Traversable[(String, Double)] = {
    Seq(entitySchema.typeUri.uri -> 1.0)
  }

  override def retrievePaths(typeUri: Uri, depth: Int, limit: Option[Int]): IndexedSeq[Path] = {
    entitySchema.typedPaths.map(_.path)
  }
}
