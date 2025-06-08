### **Operator's Field Manual: Conversational DDM with the DSAC v3.2 Agent**

**Welcome, Operator.** You are the human partner to the DSAC v3.2 Autonomous Agent. Our collaboration is governed by the DDM protocol. This manual outlines the commands and procedures for success.

#### **The Golden Rule: Context is Everything**
Every task you initiate requires context. Your prompt **MUST** always begin with the full text of the `dspec_agent_context.dspec.md` file, followed by the full text of all relevant DSpec artifacts for the task. The agent knows nothing outside of what you provide in the prompt.

---
#### **Core Commands & Workflows**

**1. Command: `DSpec: Elicit and Scaffold from Requirement`**
*   **Purpose:** To translate a high-level idea into a suite of draft DSpec artifacts. This is the starting point for all new features.
*   **Procedure:**
    1.  Provide the agent context file.
    2.  State the command.
    3.  Provide the `Natural Language Requirement` (e.g., "Build an inventory reservation system").
    4.  Provide an optional `Architectural Pattern Hint` (e.g., "Event-Sourced").
    5.  The agent will ask clarifying questions. **Answer them precisely.**
    6.  The agent will generate a complete set of draft `.dspec` files. Your job is to review, refine, and commit them.

**2. Command: `DSpec: Implement Code Spec`**
*   **Purpose:** To generate production-ready code from a finalized `code` specification.
*   **Procedure:**
    1.  Provide the agent context file.
    2.  Provide the full `code` spec you want to implement.
    3.  **Crucially, also provide the full specs of all artifacts it links to** (e.g., its `implements_api`, all `request_model` and `response_model` definitions, and any `policy` specs it applies).
    4.  State the command and the target `QualifiedName` (e.g., `Implement Code Spec code.users.HandleLogin`).
    5.  The agent will return the generated code and a report of any analysis it performed (e.g., test gap warnings).

**3. Command: `DSpec: Run Simulation`**
*   **Purpose:** To validate the logical correctness of a `behavior` or `interaction` spec before implementation.
*   **Procedure:**
    1.  Provide the agent context file and the relevant `behavior` or `interaction` spec(s).
    2.  State the command (e.g., `Run Simulation for interaction.ProcessPayment`).
    3.  The agent will prompt you for an **Initial World State** (a JSON object representing mock database tables, etc.) and a **Sequence of Trigger Events** (JSON objects representing user actions or API calls).
    4.  The agent will execute the simulation "in-mind" and return a step-by-step log and the final world state, highlighting any errors or broken invariants.

**4. Command: `DSpec: Run What-If Analysis`**
*   **Purpose:** To forecast the business and technical impact of a proposed new feature.
*   **Procedure:**
    1.  Provide the agent context file, the new `requirement` spec, and the target `kpi` spec.
    2.  State the command (e.g., `Run What-If Analysis for requirement.ApplyCouponFeature on kpi.AverageOrderValue`).
    3.  The agent will perform the entire analysis and return a final report. **It will not generate specs until you give a formal `ACCEPT` command.**

#### **Understanding Agent Responses**
*   `[INFO]`: The agent is describing its process.
*   `[WARN]`: The agent has found a non-blocking issue you should be aware of (e.g., a test gap, a deprecation notice).
*   `[ERROR]`: The agent has encountered a blocking error and cannot proceed. This is often a `PreflightCheck` failure. **You must fix the specs and try again.**
*   `[ACTION]`: The agent requires a decision or action from you (e.g., "Please respond with 'ACCEPT' or 'DISCARD'").

---
## **Document 2: The Directive Governance Process (for Architects & Tech Leads)**

This document outlines the Standard Operating Procedure (SOP) for managing the project's core "Cookbook."

---

### **SOP-ARC-01: Directive Governance**

**1. Purpose:** To ensure the quality, consistency, and security of the implementation patterns defined in `dspec_agent_context.dspec.md`, Part 3.

**2. Scope:** This process applies to any proposal for adding, modifying, or removing a `pattern`, `nfr_pattern`, `refactor_pattern`, or `architectural_pattern`.

**3. Roles:**
*   **Proposer:** Any team member who identifies a need for a new or modified directive.
*   **Directives Committee:** A standing group of tech leads and architects responsible for reviewing and approving changes.

**4. Process:**
    1.  **Proposal:** The Proposer opens a "Directive Proposal" ticket. The ticket must include:
        *   The problem statement (e.g., "We are repeatedly writing boilerplate for paginated queries").
        *   A draft of the new directive in DSpec format (e.g., a new `pattern PAGINATED_QUERY`).
        *   An example of how it would simplify an existing `detailed_behavior`.
    2.  **Review:** The Directives Committee reviews the proposal against the following criteria:
        *   **Generality:** Is the pattern broadly useful or too specific?
        *   **Performance:** Does the pattern promote efficient implementation?
        *   **Security:** Does the pattern introduce any security risks?
        *   **Clarity:** Is the `intent` clear? Is the `template` unambiguous for the agent?
        *   **Consistency:** Does it align with existing patterns and the overall architecture?
    3.  **Approval:** Changes are approved by a majority vote of the committee.
    4.  **Implementation:** An approved directive is merged into the main `dspec_agent_context.dspec.md` file.
    5.  **Versioning:** The `target_tool` version in the `directive` artifact (e.g., `PrimeCart_TS_Express_TypeORM_Agent_v3.1`) is incremented (e.g., to `v3.1.1`) following semantic versioning rules. This signals to all tools and operators that the context has changed.

---
## **Document 3: The Agent Compliance Test Suite (for the AI/Tooling Team)**

This is a DSpec file that specifies the tests for the agent itself.

---
### **File: `agent_compliance.dspec.md`**

```definitive_spec
test AgentCompliance_PreflightCheck_RejectsInvalidSpec {
    title: "Test: Agent rejects task if input specs are invalid";
    verifies_rule: "DDM-RULE-000: PreflightCheck";
    type: "Compliance";
    priority: "Critical";
    preconditions: [
        "The agent is provided with the standard DSAC v3.2 context.",
        "The task-specific specs include a `model` with a syntax error (e.g., a missing brace)."
    ];
    steps: [
        "Given the invalid context",
        "When the operator issues the command 'DSpec: Implement Code Spec' for a valid `code` spec",
        "Then the agent must halt execution immediately"
    ];
    expected_result: "The agent's first response MUST be an [ERROR] report from the PreflightCheck, detailing the syntax or schema validation failure. It MUST NOT proceed to any implementation steps.";
}

test AgentCompliance_SpecFirstUpdate_Enforced {
    title: "Test: Agent enforces Spec-First Update protocol";
    verifies_rule: "DDM-RULE-002: SpecFirstUpdate";
    type: "Compliance";
    priority: "Critical";
    preconditions: [
        "The agent is provided with valid context for `code.users.HandleLogin`.",
        "The linked `api.users.LoginUser` and `model.users.LoginPayload` specs do NOT contain a 'rememberMe' field."
    ];
    steps: [
        "Given the valid context",
        "When the operator issues a natural language request: 'Modify the login handler to support a 'rememberMe' checkbox.'",
        "Then the agent must refuse to generate code"
    ];
    expected_result: "The agent's response MUST state that the request contradicts the specifications. It MUST provide a draft of the modified `model.users.LoginPayload` and `api.users.LoginUser` specs, and it MUST NOT provide any TypeScript code.";
}

test AgentCompliance_NPlusOne_Detected {
    title: "Test: Agent proactively detects N+1 query anti-pattern";
    verifies_rule: "DDM-RULE-007: NPlusOneQueryDetection";
    type: "Compliance";
    priority: "High";
    preconditions: [
        "The agent is provided with a `code` spec containing a `FOR_EACH` loop.",
        "The `detailed_behavior` inside the loop includes a `CALL` to a data store (e.g., `CALL Abstract.UserDataStore.GetUserDetails`)."
    ];
    steps: [
        "Given the context containing the N+1 anti-pattern",
        "When the operator issues the command 'DSpec: Implement Code Spec'",
        "Then the agent must halt execution before generating the full method body"
    ];
    expected_result: "The agent's response MUST be a [WARN] about a potential N+1 anti-pattern. It MUST suggest a refactoring of the `detailed_behavior` and MUST NOT generate the flawed code.";
}
```

---
## **Document 4: The Phased Rollout Plan (for Team Leadership)**

---

### **DSAC v3.2 Adoption: A Phased Rollout Strategy**

This plan outlines a structured approach to introducing the DDM and the v3.2 agent to the development team, mitigating risk and maximizing adoption.

**Phase 0: Foundation & Training (1 Week)**
*   **Activities:**
    *   Conduct workshops for the entire team on DSpec syntax and the DDM philosophy.
    *   Review the "Operator's Field Manual" and the "Directive Governance Process" as a team.
    *   Install and configure any necessary chat integrations or prompt libraries.
*   **Goal:** Ensure everyone understands the "why" behind the new process and the "how" of basic interaction.

**Phase 1: Core Implementation & Co-Piloting (2-4 Weeks)**
*   **Focus:** Use the agent for greenfield development of non-critical features.
*   **Commands to Use:** `DSpec: Elicit and Scaffold`, `DSpec: Implement Code Spec`.
*   **Activities:**
    *   Developers practice writing specs and having the agent generate code.
    *   The team gets accustomed to the `SpecFirstUpdate` protocol.
    *   The Directives Committee is formed and handles its first few proposals.
*   **Success Metrics:**
    *   Developer confidence score > 80%.
    *   Time to implement a fully specified feature is reduced by at least 25%.

**Phase 2: Proactive QA & Refactoring Integration (Next 4 Weeks)**
*   **Focus:** Utilize the agent's analytical capabilities on existing and new code.
*   **Commands to Use:** `DSpec: Refactor Code`, plus an expectation that the agent will automatically trigger rules like `TestGapAnalysis` and `NPlusOneQueryDetection`.
*   **Activities:**
    *   Run the agent on existing, complex `code` specs to identify test gaps and performance issues.
    *   Use the `ExtractMethod` refactoring pattern to improve code quality.
    *   QA engineers work directly with the agent to validate test coverage.
*   **Success Metrics:**
    *   Number of PR comments related to common bugs (e.g., N+1) decreases significantly.
    *   Test coverage for new features, as measured by standard tools, consistently meets or exceeds targets.

**Phase 3: Autonomous & Strategic Capabilities (Ongoing)**
*   **Focus:** Leverage the most advanced generative and simulation features for strategic planning and design validation.
*   **Commands to Use:** `DSpec: Run Simulation`, `DSpec: Run What-If Analysis`.
*   **Activities:**
    *   Architects and Product Owners use the "What-If" analysis for new, high-impact features.
    *   Before implementing complex interactions, teams use the simulation command to validate the design logic.
*   **Success Metrics:**
    *   At least one major feature decision is directly informed by a "What-If" analysis report.
    *   A critical design flaw is caught by `Run Simulation` *before* implementation, with documented time/cost savings.