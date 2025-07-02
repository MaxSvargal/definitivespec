### **Operator's Field Manual: Conversational DDM with the DSAC Agent**

**Welcome, Operator.** You are the human partner to the DSAC Autonomous Agent. Our collaboration is governed by the DDM protocol. This manual outlines the commands and procedures for success.

#### **The Golden Rule: Context is Everything**
Every task you initiate requires context. Your prompt **MUST** always begin with the full text of the `dspec_agent_context.dspec.md` file, followed by the full text of all relevant DSpec artifacts for the task. The agent knows nothing outside of what you provide in the prompt.

---
#### **Core Generative & Implementation Commands**

**1. Command: `DSpec: Generate from Requirement...`**
*   **Purpose:** To transform a high-level idea into a complete, robust, and well-tested set of draft specifications. This is the starting point for all new features.
*   **Procedure:**
    1.  Provide the System Prompt and state the command.
    2.  Provide the `Natural Language Requirement`.
    3.  **The agent will initiate a dialogue**, asking clarifying questions to resolve ambiguities, infer business rules, and understand potential KPI impacts. **Answer precisely.**
    4.  The agent will then generate a complete, traceability-rich graph of draft `.dspec` files, including comprehensive tests for failure paths. Your job is to review, refine, and commit.

**2. Command: `DSpec: Implement Code Spec`**
*   **Purpose:** To generate production-ready code from a finalized `code` specification.
*   **Procedure:**
    1.  Provide the System Prompt and the primary `code` spec.
    2.  State the command (e.g., `Implement Code Spec code.users.HandleLogin`).
    3.  The agent will use the Context Resolution Protocol to ask for all linked specs (`api`, `model`, etc.).
    4.  The agent will return the generated code and a report of any analysis it performed (e.g., test gap warnings).

---
#### **Strategic & Analytical Commands**

**3. Command: `DSpec: Explore Idea...`**
*   **Purpose:** To partner with the agent during the earliest stages of product discovery.
*   **Procedure:** State the command and provide a high-level `idea` (e.g., "We should use AI to help users find products."). The agent will generate 3 distinct `requirement` hypotheses (MVP, Core, Ambitious), each with a corresponding `kpi`, to facilitate strategic decision-making.

**4. Command: `DSpec: Analyze What-If...`**
*   **Purpose:** To forecast the business impact of a proposed feature *before* committing to development.
*   **Procedure:** Provide the `requirement` and target `kpi`. The agent will run an internal simulation and return a final report. It **will not** generate specs for implementation until you give a formal `ACCEPT`.

**5. Command: `DSpec: Run Simulation`**
*   **Purpose:** To validate the logical correctness of a complex `interaction` or `behavior` spec.
*   **Procedure:** Provide the relevant spec(s). The agent will prompt for an Initial World State and Trigger Events, then return a step-by-step log of the execution.

**6. Command: `DSpec: Generate Diagram...`**
*   **Purpose:** To create visualizations from specifications for architectural reviews and onboarding.
*   **Procedure:** State the command, the `diagram_type` (`sequence`, `dependency`, `entity_relationship`), and the root spec. The agent will return a code block of Mermaid syntax that can be rendered into a diagram.

**7. Command: `DSpec: Analyze Spec Quality...`**
*   **Purpose:** To "lint" your specifications for maintainability and good design.
*   **Procedure:** Provide a `code` spec. The agent will analyze it for metrics like complexity and cohesion and provide actionable suggestions for refactoring the *spec itself*.

#### **Understanding Agent Responses**
*   `[INFO]`: The agent is describing its process.
*   `[WARN]`: A non-blocking issue you should be aware of (e.g., test gap, deprecation).
*   `[ERROR]`: A blocking error. You must fix the specs and try again.
*   `[CRITICAL]`: A security or compliance violation has been detected (e.g., by the `DataFlowSecurityAnalyzer`). This must be addressed immediately.
*   `[ACTION]`: The agent requires a decision or action from you (e.g., a `CONTEXT_REQUEST`).

---
## **Document 2: The Directive Governance Process (for Architects & Tech Leads)**

This SOP outlines the process for managing the project's "Cookbooks" (Architectural Profiles).

---

### **SOP-ARC-01: Directive Governance**

**1. Purpose:** To ensure the quality, consistency, and security of the patterns defined in the project's **Architectural Profiles** (e.g., `common_architectural_profile.md`, `architectural_ddh_profile.md`).

**2. Scope:** This process applies to any proposal for adding, modifying, or removing a `pattern`, `nfr_pattern`, `refactor_pattern`, or `architectural_pattern` from a profile.

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
        "The agent is provided with the standard DSAC context.",
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

test AgentCompliance_DataFlow_PII_Leak_Detected {
    title: "Test: Agent proactively detects a PII leak to a log";
    verifies_module: "Lifecycle.Phase2.DataFlowSecurityAnalyzer";
    type: "Compliance";
    priority: "Critical";
    preconditions: [
        "The agent is provided with DSAC v5.0 context.",
        "A `model.User` spec defines `email: string { pii_category: 'ContactInfo' }`.",
        "A `code.ProcessUser` spec contains the line `LOG 'info' 'Processing user {{user.email}}'`."
    ];
    steps: [
        "Given the context containing the PII leak",
        "When the operator issues the command 'DSpec: Implement Code Spec code.ProcessUser'",
        "Then the agent must halt execution during Phase 2 analysis"
    ];
    expected_result: "The agent's response MUST be a [CRITICAL] security warning detailing that the sensitive field 'email' is being passed to a LOG pattern. It MUST NOT proceed to code generation.";
}
```

---
## **Document 4: The Phased Rollout Plan (for Team Leadership)**

---

### **DSAC Adoption: A Phased Rollout Strategy**

This plan outlines a structured approach to introducing the DDM and the agent to the development team, mitigating risk and maximizing adoption.

**Phase 0: Foundation & Training**
*   **Activities:**
    *   Conduct workshops for the entire team on DSpec syntax and the DDM philosophy.
    *   Review the "Operator's Field Manual" and the "Directive Governance Process" as a team.
    *   Familiarize the team with the new **interactive context protocol**.
*   **Goal:** Ensure everyone understands the new, more powerful partnership model.

**Phase 1: Intelligent Scaffolding & Core Implementation**
*   **Focus:** Use the agent's advanced generative capabilities for greenfield features.
*   **Commands to Use:** `DSpec: Generate from Requirement...`, `DSpec: Implement Code Spec`.
*   **Activities:**
    *   Developers practice the new **interactive elicitation dialogue** with the agent.
    *   The team gets accustomed to reviewing the richer, more complete drafts generated by the agent (including inferred business rules and tests).
    *   The Directives Committee is formed and handles its first few profile proposals.
*   **Success Metrics:**
    *   Time to a *complete and well-tested* feature specification is reduced by 50%.
    *   Developer confidence score > 80%.

**Phase 2: Proactive Quality & Security Integration**
*   **Focus:** Leverage the agent's deep analytical modules on new and existing specs.
*   **Commands to Use:** `DSpec: Analyze Spec Quality...`, plus an expectation that the agent will automatically trigger modules like `DataFlowSecurityAnalyzer` and `TestGapAnalyzer`.
*   **Activities:**
    *   Run `Analyze Spec Quality` on existing, complex `code` specs to identify technical debt *in the specifications themselves*.
    *   Integrate a security review step where a `[CRITICAL]` warning from the agent must be addressed before proceeding.
*   **Success Metrics:**
    *   A major security or performance flaw is caught by an agent module *before* implementation.
    *   Key `code` specs are refactored for clarity based on `Analyze Spec Quality` reports.


**Phase 3: Strategic Partnership**
*   **Focus:** Utilize the agent for high-level product discovery, strategic planning, and design validation.
*   **Commands to Use:** `DSpec: Explore Idea...`, `DSpec: Run What-If Analysis`, `DSpec: Generate Diagram...`.
*   **Activities:**
    *   Product Owners work directly with the agent using `Explore Idea` to flesh out the roadmap.
    *   Architects use `Generate Diagram` to maintain a living library of system documentation.
    *   Before committing to a high-impact feature, teams use `Run What-If Analysis` to get a data-driven forecast of its value.
*   **Success Metrics:**
    *   At least one feature on the roadmap was directly born from an `Explore Idea` session.
    *   Architectural review meetings are accelerated by using agent-generated diagrams.