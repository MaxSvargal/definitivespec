# PrimeCart E-Commerce App: A DefinitiveSpec User Guide & Onboarding (v3.2)

**Welcome to the DefinitiveSpec Guide for PrimeCart!**

This guide, generated and aligned with the DSAC v3.2 Agent Context (`dspec_agent_context.dspec.md`), is your primary resource for understanding and using the Definitive Development Methodology (DDM). It serves both as an onboarding guide and an operational manual, teaching you how to write clear, precise, and powerful specifications that our AI development agent (`v3.1 Autonomous AI Agent`) uses to generate high-quality code, validate designs, and forecast business impact.

While our AI agent operates on a strict, formal protocol (defined in the agent context file), this guide provides the narrative, rationale, lifecycle, and best practices to make you an effective DDM Operator.

**Target Audience:** Developers, QAs, Product Owners, and Architects.

---
## Chapter 1: The "Why" of DDM: Core Principles & Benefits

DDM addresses common software development problems:
* Ambiguous requirements leading to rework.
* "Spec-Code Drift," where documentation no longer matches the running code.
* Lack of traceability from business need to code to test.
* Inconsistent implementation of cross-cutting concerns (security, logging).
* Difficulty predicting the impact of changes.

DDM is a structured, iterative approach where **specifications are the single source of truth.** We write structured `.dspec` files that an AI agent can understand and act upon.

**Core Principles (The "Why"):**
*   **Specification is the Single Source of Truth:** All behaviour, structure and constraints are defined in `.dspec` files. The code must reflect the spec.
    *   *Benefit:* Eliminates ambiguity; documentation is always accurate.
*	**AI as Partner & Agent:**
    * AI assists in drafting/analysing specs (Co-Pilot).
	* The `v3.1` Agent *executes* specs (Automated Implementation/Simulation). The human Operator provides clear intent via specs; the Agent provides consistent execution via `directives`.
    *   *Benefit:* Speed, consistency, automation of boilerplate and complex patterns.
*   **Automated Validation:** Specs and code are continuously checked for syntax, consistency, and link integrity. Behaviour can be simulated *before* code is written.
    *   *Benefit:* Catches errors and design flaws much earlier and cheaper.
* **Traceability:** All artifacts (requirement, design, code, test, kpi) are explicitly linked using `QualifiedName`s.
	 *   *Benefit:* Easy impact analysis – understand exactly what code/tests are affected by a requirement change.
*   **Iterative Refinement & Feedback Loops:** Development is cyclical. Discoveries during implementation or simulation *must* feed back to update the specifications first (`DDM-RULE-002: SpecFirstUpdate`).
    *   *Benefit:* The system adapts, but the specification always remains the source of truth.
*   **Business Alignment:** `kpi` artifacts directly link technical work to business goals.
    *   *Benefit:* Data-driven decisions via "What-If Analysis" (`DDM-RULE-016`).

---
## Chapter 2: The DDM Ecosystem: Your Tools

DDM is more than just file formats; it's supported by a toolset that enables the methodology.

*   🤖 **The AI Agent (DSAC v3.2):** The core engine. It reads the `dspec_agent_context.dspec.md`. It generates code based on `code` specs and `directive` patterns, runs simulations (`interaction`, `behavior`), performs analysis (`kpi`), and enforces methodology rules (`DDM-RULE-XXX`).
*    **Specification Hub (ISE):** The central library/database managing all `.dspec` files, versions, and the links (`QualifiedName`s) between them. It is the source of context.
*    **Specification Validation Suite (SVS):** The "linter" for your specs. It automatically checks syntax (Grammar), structure (Schema), and link integrity (all `QualifiedName` references resolve). The Agent performs this itself via `DDM-RULE-000: PreflightCheck`.
*   **IDE Agent:** A plugin providing in-IDE context: viewing linked specs, and critically, detecting and warning about "Spec-Code Drift" by comparing code to its source `code` spec.

> *Note: While the AI Agent is a real component defined by its context file, tools like the ISE, SVS, and IDE Agent are described here as a conceptual framework that explains the ideal DDM environment. The v3.1 AI Agent internalizes many of their functions (like spec validation via `DDM-RULE-000`).*

Understanding these roles helps you understand how your specifications are consumed and validated.
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

This is how you, the Operator, collaborate with the DSAC v3.2 agent. It's a cycle, not a waterfall.
**Feedback Loop:** Discoveries at any stage can (and should!) cause updates to earlier stages, always updating the Specification *first*.

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
* **Stage 1: Inception:** Define `requirement` and `kpi`. Goal: Capture Intent.
* **Stage 2: Detailed Spec:** Define `model`, `api`, `code`, `test`, `interaction`, `policy`. Refine `directive`s if needed. Goal: Define the "What" and "How".
* **Stage 3: Validation:** Check syntax, links, consistency (Agent `DDM-RULE-000`). Propose Simulations (`DDM-RULE-014`) / What-If Analysis (`DDM-RULE-016`). Goal: Ensure specs are correct & consistent.
* **Stage 4: Auto-Gen/Verify:** Agent generates code based on `code` specs and `directive`s (`DDM-RULE-001`, `DDM-RULE-003`). Tests run. Goal: Implementation & Verification.
* **Stage 5: Analysis/Debug:** Analyse failures or new insights. **CRITICAL: Update the SPECIFICATION FIRST (`DDM-RULE-002`)** then loop back to re-validate/re-generate. Goal: Refine & Correct the Source of Truth.


### The Workflow in Action:
This is how the stages often play out for a feature:

1.  **Elicit and Scaffold (Stages 1 & 2):**
    *   **You say:** `TASK: Generate draft specs for requirement "Allow users to add products to a wishlist".`
    *   **Agent acts:** Uses `architectural_pattern` (`DDM-RULE-010`) to generate draft `requirement`, `model`, `api`, `code`, `test` specs.
	*    **You act:** Review and refine the drafts.

2.  **Run a What-If Analysis (Stage 3 - Optional but Recommended):**
     *   **You say:** `TASK: Run What-If Analysis. Input: requirement.WishListReminderEmails, kpi.AverageOrderValue`
	 *   **Agent acts:** Executes `BusinessDrivenFeatureAnalysis` (`DDM-RULE-016`). Simulates the current state vs. the state with the new draft specs, measures the KPI impact.
     *   **Agent reports:** `[REPORT] 'WishListReminderEmails' projected to increase AverageOrderValue by +2%. Await Go/No-Go.`
	 *    **You act:** Make a data-driven decision before coding.

3.  **Validate / Simulate (Stage 3):**
	 *  **You say:** `TASK: Simulate interaction.CheckoutFlow with initial_state: {...} and events: [...]`
	 * **Agent acts:** Executes `SimulationDrivenValidation` (`DDM-RULE-014`) using `ExecuteSimulationStep` pattern, reporting final state and any inconsistencies.
	  *    **You act:** Fix `interaction` or `code` specs based on simulation bugs.

4.  **Implement the Code (Stage 4):**
    *   **You say:** `TASK: Implement Code Spec. Input: code.HandleAddItemToWishlist`
    *   **Agent acts:** Generates code, translating `detailed_behavior` using `directive` patterns (`DDM-RULE-003`), applies NFRs. Performs post-checks.
    *   **Agent reports:** `[CODE] ... [WARN] Test Gap Analysis (DDM-RULE-008): No test found for adding an out-of-stock item.`
    *   **You act:** Review code, write the missing `test` spec (Stage 2), then ask agent to implement/analyse again. Commit the result.

5. **Debug (Stage 5):**
	* A test fails. You analyse. The code doesn't match the spec.
	* **You MUST:** Update the `code.detailed_behavior` spec first (`DDM-RULE-002`) to reflect the correct logic, then ask the agent to re-implement.
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
## Appendix D: The DDM v3.2 Agent Protocol Summary
*(The Agent is bound by these rules from `dspec_agent_context.dspec.md` Part 4).*

**Phase 1: Pre-Execution Validation**
*   **`DDM-RULE-000: PreflightCheck`**: MUST validate syntax, schema, and links of all specs. Halt on error.
**Phase 2: Core Execution Principles**
*   **`DDM-RULE-001: SpecIsTruth`**: Code MUST faithfully implement `detailed_behavior`.
*   **`DDM-RULE-002: SpecFirstUpdate`**: MUST refuse changes contradicting specs; propose spec updates FIRST.
*   **`DDM-RULE-003: DirectivesAreMandatory`**: MUST use defined `directive` patterns (Part 3) for implementation.
**Phase 3: Post-Execution Analysis & QA**
*   **`DDM-RULE-007: NPlusOneQueryDetection`**: MUST warn about N+1 anti-patterns.
*   **`DDM-RULE-008: TestGapAnalysis`**: MUST report logic paths not covered by linked `test` specs.
*   **`DDM-RULE-013: ValidateConfigPath`**: MUST validate paths used in `GET_CONFIG`.
**Phase 4: Autonomous & Generative Protocols**
*    **`DDM-RULE-010/011`: Pattern Execution**: MUST use `architectural_pattern` / `refactor_pattern` for those tasks.
*   **`DDM-RULE-014: SimulationDrivenValidation`**: MUST be able to run simulations to validate `interaction`/`behavior`.
*   **`DDM-RULE-016: WhatIfAnalysisExecution`**: MUST follow `BusinessDrivenFeatureAnalysis` for KPI impact, await sign-off.
*   **`DDM-RULE-017: PatternDistillation`**: SHOULD propose new `directive` patterns for recurring complex logic.
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
*(Strategy for tasking the Agent)*

*   **Context is King:** When asking the agent a question or giving a task, always provide or reference the relevant `QualifiedName`s (e.g., `requirement.X`, `api.Y`, `code.Z`, `kpi.K`). The agent builds its understanding from the specs you provide.
*   **Be Precise:**
    * *Bad:* "Make tests for the API."
    * *Good:* `TASK: Draft 3 'test' artifacts in DSpec format for 'api.RegisterUser', verifying 'code.HandleUserRegistration'. Type='Integration'. Cover: 1. Success, 2. Duplicate Email (use error policies.ErrorCatalog.EmailAlreadyInUse), 3. Password Mismatch (use error policies.ErrorCatalog.ValidationFailed).`
*    **Use the Agent's Rules & Patterns:**
    *   Ask it to draft `detailed_behavior` using keywords it knows: `CALL`, `PERSIST`, `RETURN_ERROR`, etc.
    *   Ask it to `Implement code.MySpec`.
    *   Ask it to `Run What-If Analysis on requirement.R impacting kpi.K` (`DDM-RULE-016`).
	*   Ask it to `Simulate interaction.MyFlow` (`DDM-RULE-014`).
    *   Ask it to `Check for test gaps in code.MySpec` (`DDM-RULE-008`).
    *   Ask it to `Propose a new directive pattern for...` (`DDM-RULE-017`).
* **Directive Awareness:** Remember the agent can *only* implement abstract behaviour (`CALL`, `PERSIST`, NFRs) if there is a corresponding `pattern` or `nfr_pattern` defined in `dspec_agent_context.dspec.md` Part 3 (`DDM-RULE-003`).
* **Review Everything:** Always review the agent's output.