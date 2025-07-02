# **A DefinitiveSpec User Guide & Onboarding (v4.0)**

**Welcome to the DefinitiveSpec Guide!**

This guide, aligned with the **DSAC Agent Context**, is your primary resource for understanding and using the Definitive Development Methodology (DDM). It will teach you how to collaborate with our **AI Strategic Partner** to generate high-quality code, validate designs, forecast business impact, and even shape product strategy.

While our AI agent operates on a strict, phased lifecycle, this guide provides the narrative, rationale, and best practices to make you an effective DDM Operator.

**Target Audience:** Developers, QAs, Product Owners, and Architects.

---
## Chapter 1: The "Why" of DDM: Core Principles & Benefits

DM addresses common software development problems like ambiguous requirements, spec-code drift, and poor traceability.

**Core Principles (The "Why"):**
*   **Specification is the Single Source of Truth:** All behaviour, structure and constraints are defined in `.dspec` files.
*	**AI as a Strategic Partner:** The agent is no longer just an implementer. It's a partner in the entire lifecycle:
    *   **Strategic Partner (Product Discovery):** Helps explore ideas and form testable hypotheses (`Explore Idea...`).
    *   **Design Partner (Elicitation & Analysis):** Interactively clarifies requirements, analyzes security (`DataFlowSecurityAnalyzer`), and validates logic (`Run Simulation`).
    *   **Implementation Agent (Code Generation):** Faithfully executes finalized specs to produce code, tests, and even diagrams.
    *   *Benefit:* Unprecedented speed, consistency, and quality by leveraging AI at every stage of development.
*   **Automated Validation & Verification:** The agent's lifecycle includes built-in phases for validating specs and verifying the output, catching errors and design flaws earlier than ever.
*   **Full Lifecycle Traceability:** The agent now automatically creates a rich graph of links between all artifacts, from `requirement` to `kpi` to `test`.
*   **Iterative Refinement:** Development is a continuous loop. The agent is designed to receive feedback and help you refine specs, which always remain the source of truth.
*   **Business Alignment:** `kpi` artifacts and the `Analyze What-If...` command directly connect technical work to measurable business goals.

---
## Chapter 2: The DDM Ecosystem: Your Tools

DDM is more than just file formats; it's supported by a toolset that enables the methodology.

*   🤖 **The AI Agent:** The core of the DDM. A sophisticated partner whose behavior is defined by the `dspec_agent_context.md` System Prompt. It executes a **5-phase operational lifecycle** for every task, providing capabilities that span from strategic exploration to proactive security analysis and code generation.
*   **Architectural Profiles:** Specialized "cookbooks" (e.g., `architectural_ddh_profile.md`) that you provide to the agent to teach it a specific architectural style and technology stack.
*   **Conceptual Tools (ISE, SVS, IDE Agent):** The conceptual framework for managing, validating, and interacting with `.dspec` files. The DSAC agent internalizes many of their functions.

---

## Chapter 3: The Building Blocks: Core DSpec Artifacts

Let's explore the primary artifact types you will use to define the PrimeCart system.
*(Pro-Tip: A `QualifiedName` like `models.UserProfileResponse` is how artifacts link to each other).*

### 3.1 `requirement`: Capturing Intent
Captures user stories, functional needs, and acceptance criteria. The starting point.
```definitive_spec
requirement UserRegistration {
    title: "New User Account Registration";
    description: "As a new visitor, I want to register for an account...";
    acceptance_criteria: [ "Given...", "When...", "Then..." ];
}
```
*   **Why it matters:** Defines the goal. Used by the Agent for scaffolding features and `What-If Analysis`.

### 3.2 `model`: Defining Your Data
Defines the structure, types, and constraints of data (database entities, API payloads, events).
```definitive_spec
model UserRegistrationPayload {
    email: String {
        format: "email";
        required: true;
        pii_category: "ContactInfo"; // <-- TRIGGERS NFR DIRECTIVES
    }
    password: String { minLength: 10; required: true; }
}
```
*   **Why it matters:** The blueprint. Agent uses it for interfaces, validation, ORM entities. Attributes like `pii_category` automatically trigger Agent `directive` patterns (e.g., encryption via `nfr_pattern policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption`).

### 3.3 `api`: Specifying Service Contracts
Defines the contract for a RESTful API endpoint.
```definitive_spec
api RegisterUser {
    path: "/v1/users/register";
    method: "POST";
    request_model: models.UserRegistrationPayload; // Link to model
    response_model: models.UserProfileResponse;
    errors: [ policies.ErrorCatalog.ValidationFailed ]; // Link to error definition
}
```
 *   **Why it matters:** The public contract. Agent generates API endpoint boilerplate (routing, validation, serialization).

### 3.4 `code`: Detailing Logic
The most detailed spec. Defines a single unit of logic (function/method). `detailed_behavior` is the **single source of truth for implementation logic.**
```definitive_spec
code HandleUserRegistration {
    implements_api: apis.RegisterUser;
    language: "TypeScript";
     implementation_location: { filepath: "src/...", entry_point_name: "handleRegistration" };
    signature: "async function(payload: UserRegistrationPayload): Promise<UserProfileResponse>";
    detailed_behavior: `
        // Check for existing user - abstract call
        DECLARE existingUser = CALL Abstract.UserDataStore.CheckByEmail WITH { email: payload.email };
        IF existingUser IS_PRESENT THEN
            RETURN_ERROR policies.ErrorCatalog.EmailAlreadyInUse; // Abstract error
        END_IF
       // ... more logic
       // Persist - abstract data operation
        PERSIST newUserEntity TO Abstract.UserDataStore;
        RETURN_SUCCESS newUser;
    `;
}
```
*   **Why it matters:** The implementation blueprint.
*   **Pro-Tip:** Keep `detailed_behavior` ABSTRACT. Use keywords (`CALL`, `PERSIST`, `RETURN_ERROR`). This makes logic resilient to tech changes. The Agent uses its `directive` patterns (Part 3 of context) to translate these keywords into concrete code.

> **Example: From Spec to Code**
>
> Let's see how the Agent combines a `code` spec and a `directive` to generate code.
>
> **1. The Spec (`code.HandleUserRegistration`):**
> ```definitive_spec
> detailed_behavior: `
>     // ...
>     DECLARE existingUser = CALL Abstract.UserDataStore.CheckByEmail WITH { email: payload.email };
>     // ...
> `
> ```
>
> **2. The Directive (`dspec_agent_context.dspec.md`):**
> ```definitive_spec
> pattern CALL(...) -> {
>     lookup: {
>         "Abstract.UserDataStore.CheckByEmail": {
>             call: "await this.userRepository.findOneBy({ email: {{with_clause_object.email}} });",
>             inject: { name: "userRepository", type: "Repository<UserEntity>" }
>         },
>     }
> };
> ```
>
> **3. The Agent's Generated TypeScript Code:**
> ```typescript
> // In the generated class/handler...
>
> // Dependency injection handled by the 'inject' directive
> private readonly userRepository: Repository<UserEntity>;
>
> async handleRegistration(payload: UserRegistrationPayload): Promise<...> {
>     // ...
>     // The 'call' template is rendered here
>     const existingUser = await this.userRepository.findOneBy({ email: payload.email });
>     // ...
> }
> ```
> This makes the abstract-to-concrete link tangible for a new developer.

### 3.5 `test`: Ensuring Correctness
Specifies a single test case, linking directly to the requirements or code it verifies.
```definitive_spec
test UserRegistration_DuplicateEmail {
    title: "Test user registration with a duplicate email";
    verifies_code: [code.HandleUserRegistration];
    type: "Integration";
    steps: [ "Given...", "When...", "Then..." ];
    expected_result: "System prevents duplicate registration.";
}
```
*   **Why it matters:** Defines "done" and "correct". Agent can generate test skeletons and perform Test Gap Analysis (`DDM-RULE-008`).

### 3.6 `kpi`: Measuring Business Value
Defines a business metric and links it to the specs that influence it.
```definitive_spec
 kpi CheckoutConversionRate {
    title: "Checkout Conversion Rate";
    description: "Percentage of users who start checkout and complete an order.";
    metric_formula: "(count(events.OrderCompleted) / count(events.CheckoutStarted)) * 100";
    target: "> 65%";
    related_specs: [ interaction.CheckoutFlow, api.PlaceOrder ];
 }
```
* **Why it matters:** The bridge to business value. Enables the Agent's `BusinessDrivenFeatureAnalysis` to predict how a `requirement` change might impact this `kpi`.

### 3.7 `directive`: The Agent's Cookbook
Not written for every feature, but defines *how* the agent implements abstract concepts.
```definitive_spec
 // From dspec_agent_context.dspec.md Part 3
 pattern PERSIST(entity_variable, Abstract_DataStore_Name) -> {
    intent: "Save entity...";
    template: "await this.{{Abstract_DataStore_Name | to_repository_name}}.save({{entity_variable}});";
 }
 nfr_pattern policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption -> {
     intent: "Encrypt PII...";
     trigger: "model_field.has('pii_category')";
      template: "{{field_name}} = piiEncrypt({{field_name}});";
 }
```
* **Why it matters:** This is how the Agent knows *how* to translate abstract `detailed_behavior` keywords (`PERSIST`) or apply NFRs (`pii_category`) into specific TypeScript/TypeORM/Express code. The agent MUST follow these (`DDM-RULE-003`).
*   **Pro-Tip:** `directive`s are typically defined at the project/team level by an architect or tech lead. As a developer, your primary role is to *use* the abstract keywords (`PERSIST`, `CALL`) defined in the directives, not to write new directives for every feature.

### 3.8 `interaction` / `behavior`: Modelling Flow
Define sequences between components (`interaction`) or state machines (`behavior { fsm ... }`).
 * **Why it matters:** Capture complex flows. Enable the Agent to run `SimulationDrivenValidation` (`DDM-RULE-014`) to check logic *before* coding.

---

## Chapter 4: The DDM Lifecycle & Workflow

This is how you collaborate with the DSAC agent. The old, linear stage-gate process has been replaced by a more dynamic, AI-centric lifecycle.

**The 5-Phase Lifecycle (The Agent's Internal Process):**
1.  **Context & Validation:** The agent receives your initial request and interactively asks for all necessary context files.
2.  **Pre-Generation Analysis:** The agent runs a suite of analytical modules (e.g., `DataFlowSecurityAnalyzer`, `NPlusOneDetector`) to find issues *before* implementation.
3.  **Core Task Execution:** The agent executes your primary command (`Implement`, `Generate`, `Analyze`, etc.).
4.  **Post-Generation Verification:** The agent runs QA modules (e.g., `TestGapAnalyzer`) on the generated artifacts.
5.  **System Refinement:** The agent looks for opportunities to improve the DDM process itself (e.g., `PatternDistillation`).

```
+-----------------------------------------------------------------------+
|    (Ideas, Business Needs)                                            |
|            |                                                          |
|            v                                                          | Feedback
|      [ STAGE 1: Inception ] ---> (req, kpi)                           |   ^
|            |                                                          |   |
|            v                                                          |   |
|      [ STAGE 2: Detailed Spec ] -> (design, api, model, code, test,   |   |
|            |                          interaction, policy, directive) |   |
|            v                                                          |   |
|      [ STAGE 3: Spec Validation ] <-------(Refinements)---------------+---+-> SVS / Agent Preflight (DDM-RULE-000)
|            |                                         ^                |
|            v (Validated Specs)                       | Feedback       |
|      [ STAGE 4: Auto-Gen & Verify (AI Agent) ] ------|----------------+--->[Code/Tests]
|            |                                         |                |
|            v (Failures, Code Discoveries)            |                |
|      [ STAGE 5: Analysis & Debug ] ------------------+ (Update Spec!) | Rule DDM-RULE-002
+-----------------------------------------------------------------------+
```
### **The Workflow in Action:**

**1. Explore an Idea (Product Discovery)**
*   **You (Product Owner) say:** `DSpec: Explore Idea... "We should use gamification to increase user engagement."`
*   **Agent acts:** Generates three distinct `requirement` drafts (e.g., "Basic Points System," "Leaderboard Feature," "Achievement Badges"), each with a corresponding `kpi` spec.

**2. Analyze the Impact (Strategic Validation)**
*   **You (Team Lead) say:** `DSpec: Analyze What-If... on requirement.LeaderboardFeature impacting kpi.UserSessionDuration`
*   **Agent acts:** Runs an internal simulation. `[REPORT] The 'LeaderboardFeature' is projected to increase UserSessionDuration by 15%, but may slightly decrease initial page load speed due to new data queries. Await Go/No-Go.`
*   **You act:** Your team decides the trade-off is acceptable and gives the `ACCEPT` command.

**3. Generate from a Requirement (Interactive Scaffolding)**
*   **You (Developer) say:** `DSpec: Generate from Requirement... requirement.LeaderboardFeature`
*   **Agent acts:** Initiates a dialogue. `[ACTION] CLARIFICATION_REQUEST: 1. Should the leaderboard be global or per-team? 2. What is the time window (daily, weekly, all-time)? ...`
*   **You act:** Answer the questions precisely.
*   **Agent acts:** Generates a complete set of draft specs, including `model`, `api`, `code`, and a complex `interaction` spec named `interaction.UpdateLeaderboard`.

**4. Validate the Logic (Pre-Implementation Simulation)**
*   **You (QA Engineer) say:** `DSpec: Run Simulation for interaction.UpdateLeaderboard`
*   **Agent acts:** `[ACTION] Please provide an Initial World State and a Sequence of Trigger Events.`
*   **You act:** Provide JSON representing several users with scores, and a sequence of events where two users achieve the same new score.
*   **Agent acts:** Executes the simulation. `[WARN] Simulation completed. A logic flaw was detected: in a tie-breaker scenario, the user who submitted their score last is incorrectly ranked higher. The `detailed_behavior` in `code.CalculateRankings` needs a tie-breaking rule.`

**5. Refine, Implement, and Validate Code**
*   **You (Developer) act:** You update the `detailed_behavior` in `code.CalculateRankings` to add a secondary sort key (e.g., timestamp) to handle ties.
*   **You say:** `DSpec: Implement Code Spec code.UpdateUserScore`
*   **Agent acts:** Uses the **Context Resolution Protocol** to ask for any needed files. Once context is complete, it runs its full lifecycle. It might issue a `[WARN]` about a test gap or a `[CRITICAL]` security notice before finally generating the code.

**6. Debug and Iterate (The Realistic Loop)**
*   **Scenario:** A user-reported bug reveals that daily leaderboards are not resetting at midnight UTC.
*   **You (Developer) act:** You identify the flaw in the `code.ResetDailyLeaderboard` spec. The `CALL` to the date service was incorrect.
*   **You MUST:** Update the `detailed_behavior` in the `code.ResetDailyLeaderboard` spec to use the correct abstract `CALL`. The `SpecFirstEnforcer` module makes this mandatory.
*   **You say:** `DSpec: Implement Code Spec code.ResetDailyLeaderboard`
*   **Agent acts:** Re-generates only the corrected method, which now passes all tests. This "debug" cycle, driven by updating the spec first, ensures the system's source of truth is always accurate.

---

## Appendix A: Normative Grammar (EBNF)
*(Content from `dspec_agent_context.dspec.md` Part 1 - Copied exactly for consistency)*
```ebnf
DspecFile ::= (TopLevelDefinition | Comment)* ;

Comment ::= SingleLineComment | MultiLineComment ;
SingleLineComment ::= '//' /(.)*/ ;
MultiLineComment ::= '/*' ( /(?s)(?:[^*]|(?:\*+(?:[^*/])))*/ ) '*/' ;

TopLevelDefinition ::= Keyword ArtifactName=Identifier ArtifactBlock ;
Keyword ::= 'requirement' | 'design' | 'model' | 'api' | 'code' | 'test'
          | 'behavior' | 'policy' | 'infra' | 'directive' | 'interaction'
          | 'event' | 'glossary' | 'kpi' ;

Identifier ::= /[a-zA-Z_][a-zA-Z0-9_]*/ ;
QualifiedIdentifier ::= Identifier ('.' Identifier)* ;

ArtifactBlock ::= '{' (AttributeAssignment | NestedArtifact)* '}' OptionalSemicolon ;
OptionalSemicolon ::= (';')? ;

AttributeAssignment ::= AttributeName=Identifier ':' AttributeValue=Value OptionalSemicolon ;
NestedArtifact ::= FsmDef | FormalModelDef | ErrorCatalogDef | LoggingDef | SecurityDef | NfrGuidanceDef
                 | ConfigurationDef | DeploymentDef | SpecificDirectiveBlock | InteractionStepDef ;

Value ::= StringValue | IntegerValue | NumberValue | BooleanValue
        | IDReferenceValue | ListValue | ObjectLiteralValue ;

StringValue ::= '"' ( /[^"\\]/ | /\\./ )* '"' | '`' ( /[^`\\]/ | /\\./ )* '`' ;
IntegerValue ::= /-?[0-9]+/ ;
NumberValue ::= /-?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/ ;
BooleanValue ::= 'true' | 'false' ;
IDReferenceValue ::= QualifiedIdentifier ;
ListValue ::= '[' (Value (',' Value)*)? ']' ;
ObjectLiteralValue ::= '{' (ObjectEntry (',' ObjectEntry)*)? '}' ;
ObjectEntry ::= (Identifier | '"' ( /[^"\\]/ | /\\./ )* '"') ':' Value ;

ModelFieldDef ::= FieldName=Identifier ':' FieldType=QualifiedIdentifier ('{' (ModelFieldConstraint | PiiCategoryAttribute)* '}' )? OptionalSemicolon ;
PiiCategoryAttribute ::= ('pii_category' ':' StringValue) OptionalSemicolon;
ModelFieldConstraint ::= ('required'|'default'|'description'|'minLength'|'maxLength'|'pattern'|'minimum'|'maximum'|'enum'|'format'|'minItems'|'maxItems'|'uniqueItems') ':' Value OptionalSemicolon;

InteractionStepDef ::= 'step' StepID=Identifier '{' (('component'|'description'|'action'|'sends_message'|'sends_reply_for_message_from_step'|'with_payload_model'|'guard'|'next_step'|'is_endpoint'|'implemented_by_code') ':' Value)* '}' OptionalSemicolon;

FsmDef ::= 'fsm' Name=Identifier '{' (('initial' ':' IDReferenceValue) | ('description' ':' StringValue) | FsmState | FsmTransition)* '}' OptionalSemicolon ;
FsmState ::= 'state' StateName=Identifier ('{' (('description'|'on_entry'|'on_exit') ':' Value)* '}')? OptionalSemicolon ;
FsmTransition ::= 'transition' '{' (('from'|'to'|'event'|'guard'|'action'|'description'|'realized_by_code') ':' Value)* '}' OptionalSemicolon ;

FormalModelDef ::= 'formal_model' Name=Identifier ArtifactBlock ;
ErrorCatalogDef ::= 'error_catalog' Name=Identifier '{' (ErrorDefinition | ('description' ':' Value))* '}' OptionalSemicolon ;
ErrorDefinition ::= 'define' ErrorName=Identifier '{' (('http_status'|'log_level'|'message_template'|'is_retryable'|'error_code'|'description') ':' Value)* '}' OptionalSemicolon ;

ConfigurationDef ::= 'configuration' Name=Identifier '{' (ConfigFieldDef | ('description' ':' Value))* '}' OptionalSemicolon;
ConfigFieldDef ::= FieldName=Identifier ':' FieldType=QualifiedIdentifier ('{' (('required'|'default'|'description'|'constraints'|'sensitive') ':' Value)* '}' )? OptionalSemicolon ;
```

---
## Appendix B: Glossary of Key Terms
*   **AI Agent / DSAC Agent:** The AI model acting under the rules of the `dspec_agent_context.dspec.md`.
*   **Artifact:** A single, named block of specification (e.g., `requirement UserLogin`).
*    **DDM (Definitive Development Methodology):** The overall spec-first, AI-partnered development process.
*   **Detailed Behavior:** The attribute in a `code` spec containing abstract, constrained pseudocode; the single source of truth for implementation logic.
*   **Directive / Pattern:** A rule/template in the agent's context (Part 3) mapping an abstract concept (`PERSIST`, NFR) to concrete code. The "Cookbook".
*   **IDE Agent:** (Conceptual) IDE plugin to link code/specs and detect drift.
*   **ISE / Specification Hub:** (Conceptual) Central repository managing specs and their links.
*   **Operator:** The human (developer, PM, architect) interacting with the AI agent.
*   **Qualified Name:** The unique identifier for an artifact, used for linking (e.g., `models.User`).
*   **Simulation:** Agent execution of `interaction`/`behavior` logic against a mock state to validate design (`DDM-RULE-014`).
 *   **SVS / Spec Validation Suite:** (Conceptual) Tool for checking spec syntax, schema, links. (Agent performs this via `DDM-RULE-000`).
*   **What-If Analysis:** A simulation to forecast the business/KPI impact of a proposed `requirement` (`DDM-RULE-016`).
---
## Appendix C: Artifact Quick Reference
*(Based on `dspec_agent_context.dspec.md` Part 2 schema. `?` = optional).*
*   **`requirement`**: `title`: string; `description?`: string; `acceptance_criteria?`: list<string>;
*   **`model`**: `description?`: string; Fields: `FieldName: Type { required?, format?, pii_category?, ... }`;
*   **`api`**: `path`: string; `method`: string; `request_model?`: QName<model>; `response_model?`: QName<model>; `errors?`: list<QName>;
*   **`code`**: `language`: string; `implementation_location`: object; `signature`: string; `detailed_behavior`: string; `implements_api?`: QName<api>;
*   **`test`**: `title`: string; `type`: string; `steps`: list<string>; `expected_result`: string; `verifies_... ?`: list<QName>;
*    **`kpi`**: `title`: string; `metric_formula`: string; `target`: string; `related_specs`: list<QName>;
*   **`interaction`**: `description?`: string; `components`: list<QName<design>>; `steps`: list<object>;
*   **`behavior`**: `description?`: string; Contains nested `fsm` or `formal_model`;
*   **`policy`**: `description?`: string; Contains nested `error_catalog`, `nfr`, etc;
*  **`directive`**: `target_tool`: string; Contains `pattern`, `nfr_pattern`, `refactor_pattern`, `architectural_pattern`;

*(Other artifact schemas detailed here based on Part 2).*
---
## Appendix D: The DDM Agent Protocol Summary
*(This appendix replaces the old `DDM-RULE-XXX` summary with a detailed breakdown of the new 5-phase lifecycle, telling the Operator what to expect and what their role is in each phase.)*

The Agent is bound by its 5-phase operational lifecycle for every task. Understanding this process is key to effective collaboration.

#### **Phase 1: Context & Validation (Universal Bootstrap)**
*   **What the Agent Does:** This is the agent's mandatory entry point. It will parse all the initial files you provide, validate them against its internal grammar and schemas, and identify all linked dependencies (`QualifiedName`s).
*   **The Key Interaction:** If any dependency is missing, the agent will **HALT** and issue an `[ACTION] CONTEXT_REQUEST`. It will not proceed until you provide the requested files. This may happen several times as it discovers new dependencies.
*   **Your Role as Operator:** Start with a minimal prompt (System Prompt + primary spec). Be prepared to respond to `CONTEXT_REQUEST`s by providing the full text of the requested files. The agent drives this process; your job is to respond.

#### **Phase 2: Pre-Generation Analysis**
*   **What the Agent Does:** Before writing any code or specs, the agent becomes a design and security analyst. It runs a suite of powerful modules to find problems early. It will check for:
    *   Contradictions between your request and the specs (`SpecFirstEnforcer`).
    *   Use of deprecated components (`DeprecationWarner`).
    *   Potential performance anti-patterns like N+1 queries (`NPlusOneDetector`).
    *   **Critical security flaws**, like PII data being logged or sent to untrusted services (`DataFlowSecurityAnalyzer`).
*   **Your Role as Operator:** Pay close attention to `[WARN]` and `[CRITICAL]` messages. These are not suggestions; they are actionable insights that must be addressed before proceeding. This phase is designed to save you from costly mistakes downstream.

#### **Phase 3: Core Task Execution**
*   **What the Agent Does:** The agent now executes your primary command. This is the most versatile phase, where the agent might be acting as an implementer, a refactoring tool, a strategic partner, or a diagramming assistant.
*   **Your Role as Operator:** Clearly state your command. Whether you ask it to `Implement Code Spec`, `Explore Idea`, `Generate Diagram`, or `Analyze What-If`, the agent will follow the specific workflow for that task.

#### **Phase 4: Post-Generation Verification**
*   **What the Agent Does:** After generating an artifact (primarily code), the agent becomes a QA engineer. It runs its `TestGapAnalyzer` module to compare the logic it just wrote against the linked `test` specs.
*   **Your Role as Operator:** Review any `[WARN]` messages about missing test coverage. The agent will often provide a draft of the missing `test` spec for you to review and commit, ensuring quality is maintained.

#### **Phase 5: System Refinement**
*   **What the Agent Does:** As its final step, the agent acts as an architect. It runs modules like `PatternDistillation` and `CrossRequirementPatternAnalyzer` to look for ways to improve the project's specifications and patterns.
*   **Your Role as Operator:** Treat `[INFO] Abstraction Opportunity` messages as valuable architectural advice. These suggestions help you maintain a clean, DRY, and evolving specification-base over the long term.

---
## Appendix E: Common Pitfalls & Best Practices
*(Distilled advice for the Operator)*

*   ### Pitfall: Spec-Code Drift
    *   **Problem:** Code is changed directly (e.g., hotfix), but the `code.detailed_behavior` spec is not updated. The spec is no longer the source of truth.
    *   **Avoid By:** ALWAYS update the spec first! The agent enforces this (`DDM-RULE-002: SpecFirstUpdate`). Use the (conceptual) IDE Agent to detect drift.
*    ### Pitfall: Over-Specification / Code-in-Spec
    *   **Problem:** Writing actual TypeScript/database code within `code.detailed_behavior` instead of abstract keywords.
    *   **Avoid By:** Focus `detailed_behavior` on *business logic flow* using keywords (`CALL`, `PERSIST`, `IF`, `RETURN_ERROR`). Let the `directive` patterns handle the "how". Abstraction makes specs resilient.
*   ### Pitfall: Under-Specification / Missing Directives
     *   **Problem:** `detailed_behavior` is too vague, OR it uses an abstract `CALL Some.Service` for which no `directive` pattern exists in Part 3. The Agent cannot implement it.
     *    **Avoid By:** Be precise in `detailed_behavior`. If a pattern is missing, the agent will report it (`DDM-RULE-003`), or you can ask it to propose one (`DDM-RULE-017`). Define the `directive` pattern first.
*    ### Pitfall: Logic in Directives
     *   **Problem:** Putting complex business logic (`IF/ELSE`) inside a `directive` template.
     *    **Avoid By:** Business rules belong in `code.detailed_behavior`. Directives are for *translating* abstract steps into technology-specific implementation, not for defining the steps themselves.
*    ### Pitfall: Ignoring NFRs / Policies
     *   **Problem:** Forgetting `pii_category: "ContactInfo"` on a `model` field, so the agent's `nfr_pattern` for encryption is never triggered. Forgetting to list relevant errors in `api.errors` or `code.throws_errors`.
     *    **Avoid By:** Be mindful of attributes that trigger agent behaviour. Use `policy.error_catalog` consistently with `RETURN_ERROR`.
*    ### Pitfall: Blind Trust in AI
     *   **Problem:** Accepting AI-generated specs or code without review.
     *    **Avoid By:** The Agent is a tool. ALWAYS review generated artifacts (specs, code, analysis reports) for correctness and alignment with intent.
*   ### Pitfall: Broken/Ambiguous Links
    * **Problem:** Referencing `models.User` when the artifact is actually `users.UserProfile`.
	* **Avoid By:** Use consistent naming. Rely on the Agent's `DDM-RULE-000: PreflightCheck` to catch broken `QualifiedName` links.
---
 ## Appendix F: Thinking with the AI: Effective Interaction

#### **1. Let the Agent Drive Context**
*   The agent now handles this for you via its **Context Resolution Protocol**. Start your prompt with only the primary artifact for your task (e.g., just the `code` spec). The agent will analyze it and tell you exactly what other files it needs via an `[ACTION] CONTEXT_REQUEST`. This saves you tokens and effort.

#### **2. Embrace the Elicitation Dialogue**
*   When you use `DSpec: Generate from Requirement...`, the agent's first step is to ask you clarifying questions. This dialogue is a core feature. Answering its questions about constraints, edge cases, and KPI impacts is the most effective way to get a high-quality, complete set of draft specs that capture your true intent.

#### **3. Use the Full Spectrum of Commands**
The agent is much more than a code generator. To be effective, you must use its full toolkit.
*   **For Product Owners & Strategists:** Use `Explore Idea...` to brainstorm your roadmap and `Analyze What-If...` to get data-driven forecasts before committing resources.
*   **For Architects & Tech Leads:** Use `Generate Diagram...` to create living documentation for design reviews. Pay close attention to the agent's `System Refinement` phase for suggestions on improving your architectural patterns.
*   **For Developers & QAs:** Use `Analyze Spec Quality...` to find technical debt in your specs. Use `Run Simulation` to validate complex logic before you write a single line of implementation code.

#### **4. Understand Your Architectural Profile**
* The agent's implementation knowledge now comes from the **Architectural Profiles** you provide (e.g., `common_architectural_profile.md`, `architectural_ddh_profile.md`). To be effective, you must know what `pattern`s are available in your project's profile. If the agent reports that it cannot resolve a `CALL` to `Abstract.SomeService`, it means a definition for that service needs to be added to your project's profile.

#### **5. Trust, but Always Verify**
*   **This principle is timeless.** The DSAC agent is an incredibly powerful partner, but it is still a tool. You, the human Operator, are the final authority on correctness and intent.
*   **ALWAYS** review generated artifacts—whether they are specs, code, diagrams, or analysis reports. Your critical eye is the most important component of the Definitive Development Methodology.