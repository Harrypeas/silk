package org.silkframework.execution.local

import org.scalatest.{FlatSpec, MustMatchers}
import org.silkframework.workspace.SingleProjectWorkspaceProviderTestTrait
import org.silkframework.workspace.activity.workflow.{LocalWorkflowExecutor, Workflow}

/**
  * Tests the SPARQL select task in a workflow.
  */
class SparqlSelectIntegrationTest extends FlatSpec with SingleProjectWorkspaceProviderTestTrait with MustMatchers {
  override def projectPathInClasspath: String = "org/silkframework/execution/SPARQLselect.zip"

  override def projectId: String = "sparqlSelectProject"

  override def singleWorkspaceProviderId: String = "inMemory"

  private val workflow = "sparqlSelectWorkflow"

  behavior of "SPARQL select task"

  it should "produce the correct result" in {
    checkOutputResource("sparqlOutput.csv", "s,v")
    val workflowTask = project.task[Workflow](workflow)
    val executeActivity = workflowTask.activity[LocalWorkflowExecutor]
    executeActivity.control.startBlocking()
    val expectedResult = """s,v
      |http://ns.eccenca.com/unemployment20,7.2
      |http://ns.eccenca.com/unemployment18,6.9
      |http://ns.eccenca.com/unemployment4,6.2
      |http://ns.eccenca.com/unemployment10,6
      |http://ns.eccenca.com/unemployment19,7.1""".stripMargin
    checkOutputResource("sparqlOutput.csv", expectedResult)
  }

  private def checkOutputResource(name: String, expectedResult: String): Unit = {
    val outputResource = project.resources.getInPath(name)
    outputResource.loadAsString("UTF-8") mustBe expectedResult
  }
}
