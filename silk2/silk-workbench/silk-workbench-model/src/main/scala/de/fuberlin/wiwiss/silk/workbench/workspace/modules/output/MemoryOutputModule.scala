/* 
 * Copyright 2011 Freie Universität Berlin, MediaEvent Services GmbH & Co. KG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.fuberlin.wiwiss.silk.workbench.workspace.modules.output

import de.fuberlin.wiwiss.silk.util.Identifier
import java.util.logging.Logger

/**
 * Output module which holds all outputs in memory.
 */
class MemoryOutputModule extends OutputModule
{
  private val log = Logger.getLogger(classOf[MemoryOutputModule].getName)

  private var outputsTasks = Map[Identifier, OutputTask]()

  def config = OutputConfig()

  def config_=(c: OutputConfig) { }

  override def tasks = synchronized { outputsTasks.values }

  override def update(task : OutputTask) = synchronized
  {
    outputsTasks += (task.name -> task)
    log.info("Updated output '" + task.name)
  }

  override def remove(taskId : Identifier) = synchronized
  {
    outputsTasks -= taskId
    log.info("Removed output '" + taskId)
  }
}
