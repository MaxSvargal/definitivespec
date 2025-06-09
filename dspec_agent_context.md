# DefinitiveSpec Agent Context (DSAC) v3.1

**Objective:** This document provides the complete normative context for a **v3.1 Autonomous AI Agent**. The agent's capabilities include high-fidelity code generation, advanced refactoring, **executable spec simulation, automated consistency validation, and business-driven what-if analysis.** The agent must adhere to all sections.

---

## Part 1: Normative EBNF Grammar

This EBNF defines the valid syntax for all `.dspec` files. The agent must parse input specifications according to this grammar.

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

## Part 2: Artifact Reference Schema (Type System)

This schema defines the structure and attributes for each DefinitiveSpec artifact type. The agent must use this as the "type system" for understanding specifications. `QualifiedName` is the primary identifier for cross-linking.

```dspec
// Notation: `?` denotes optional. `list<T>` is a list of type T.
// `QualifiedName<artifact_type>` indicates the link must resolve to an artifact of that type.
// All string values can be single or multi-line.

schema requirement {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    acceptance_criteria?: list<string>;
    source?: string;
}

schema design {
    title: string;
    description?: string;
    responsibilities?: list<string>;
    fulfills?: list<QualifiedName<requirement>>;
    dependencies?: list<QualifiedName<design>>;
    applies_nfrs?: list<QualifiedName<policy.nfr>>;
}

schema model {
    description?: string;
    version?: string;
    // Fields are defined inline: FieldName: Type { constraints }
    // Example: email: string { required: true, format: "email", pii_category: "ContactInfo" }
}

schema api {
    title?: string;
    summary?: string;
    operationId?: string;
    part_of?: QualifiedName<design>;
    path: string;
    method: string;
    version?: string;
    request_model?: QualifiedName<model>;
    response_model?: QualifiedName<model>;
    errors?: list<QualifiedName<policy.error_catalog.define>>;
    security_scheme?: list<QualifiedName<policy.security.authentication_scheme>>;
    tags?: list<string>;
}

schema code {
    title?: string;
    implements_api?: QualifiedName<api>;
    part_of_design?: QualifiedName<design>;
    language: string;
    implementation_location: object; // { filepath, entry_point_name }
    signature: string;
    preconditions?: list<string>;
    postconditions?: list<string>;
    detailed_behavior: string; // Constrained Pseudocode for code generation
    throws_errors?: list<QualifiedName<policy.error_catalog.define>>;
    dependencies?: list<string>; // Abstract dependencies
    applies_nfrs?: list<QualifiedName<policy.nfr>>;
}

schema test {
    title: string;
    description?: string;
    verifies_requirement?: list<QualifiedName<requirement>>;
    verifies_api?: list<QualifiedName<api>>;
    verifies_code?: list<QualifiedName<code>>;
    verifies_nfr?: list<QualifiedName<policy.nfr>>;
    verifies_behavior?: list<QualifiedName<behavior>>;
    type: string;
    priority?: string;
    test_location: object; // { framework, filepath, test_case_id_in_file }
    preconditions?: list<string>;
    steps: list<string>;
    expected_result: string;
    data_inputs?: object | string;
}

schema interaction {
    title?: string;
    description?: string;
    components: list<QualifiedName<design>>;
    message_types?: list<QualifiedName<model>>;
    initial_component?: QualifiedName<design>;
    steps: list<object>; // Object structure follows InteractionStepDef grammar
}

schema behavior {
    title?: string;
    description?: string;
    // Contains nested 'fsm' or 'formal_model' artifacts.
}

schema policy {
    title?: string;
    description?: string;
    // Contains nested 'error_catalog', 'logging', 'security', or 'nfr' artifacts.
}

schema infra {
    title?: string;
    description?: string;
    // Contains nested 'configuration' or 'deployment' artifacts.
}

schema directive {
    target_tool: string;
    description?: string;
    // Contains tool-specific key-value pairs and nested blocks.
}

schema event {
    title?: string;
    description?: string;
    payload_model: QualifiedName<model>;
}

schema glossary {
    title?: string;
    description?: string;
    // Contains a list of term definitions.
}

schema kpi {
    title: string;
    description: string;
    metric_formula: string; // A formula referencing events or models, e.g., "(count(events.OrderCompleted) / count(events.CheckoutStarted)) * 100"
    target: string; // A target for the metric, e.g., "> 65%", "< 150ms"
    related_specs: list<QualifiedName>; // Links to behaviors, interactions, or APIs that influence this KPI.
}
```

---

## Part 3: Core Implementation & Generative Directives for "PrimeCart_TS_Express_TypeORM_Agent_v3.1"

These directives are the agent's **"Cookbook of Implementation, Refactoring, & Generative Patterns."** They are mandatory for all code generation and modification tasks. The `target_tool` version is updated to reflect the new capabilities.

```dspec
// --- `detailed_behavior` Keyword Implementation Patterns (Translation) ---

pattern PERSIST(entity_variable, Abstract_DataStore_Name) -> {
    intent: "Save a new or updated entity to the primary data store. This operation must be atomic and handle potential database errors.";
    example_spec: "PERSIST newUserEntity TO Abstract.UserDataStore";
    pre_hook_triggers: ["policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption"];
    post_hook_triggers: ["policies.PrimeCartMonitoringPolicies.AuditLogging"];
    template: "await this.{{Abstract_DataStore_Name | to_repository_name}}.save({{entity_variable}});";
    imports: [];
}

pattern CALL(Abstract_Service_Call, with_clause_object) -> {
    intent: "Invoke a well-defined, abstract dependency. This separates business logic from the specific implementation of a dependency.";
    lookup: {
        "Abstract.UserDataStore.CheckByEmail": {
            call: "await this.userRepository.findOneBy({ email: {{with_clause_object.email}} });",
            inject: { name: "userRepository", type: "Repository<UserEntity>" }
        },
        "Abstract.PasswordHasher.Hash": {
            call: "await this.passwordHasher.hash({{with_clause_object.password}});",
            inject: { name: "passwordHasher", type: "PasswordHasherService" }
        },
        "Abstract.FeatureFlagService.IsEnabled": {
            call: "await this.featureFlagService.isEnabled('{{with_clause_object.flag_name}}', { user: {{with_clause_object.user_context}} });",
            inject: { name: "featureFlagService", type: "FeatureFlagService" }
        },
        "Abstract.SystemDateTimeProvider.CurrentUTCDateTime": {
            call: "this.dateTimeProvider.now();",
            inject: { name: "dateTimeProvider", type: "DateTimeProvider" }
        }
    };
    imports: { "Abstract.UserDataStore.CheckByEmail": ["import { Repository } from 'typeorm';", "import { UserEntity } from '@/models/entities';"] };
}

pattern TRANSACTIONAL_BLOCK -> {
    intent: "Execute a sequence of database operations as a single atomic transaction. If any operation within the block fails, all previous operations in the block must be rolled back.";
    wrapper_template: "await this.dataSource.transaction(async (transactionalEntityManager) => { {{transactional_block_body_placeholder}} });";
    imports: ["DataSource from 'typeorm'"];
}

pattern FOR_EACH(item_variable, list_variable) -> {
    intent: "Iterate over a collection and perform actions. Agent must check for anti-patterns inside the loop.";
    example_spec: "FOR_EACH item IN order.items { CALL Abstract.Inventory.ReserveStock WITH {item: item} }";
    template: "for (const {{item_variable}} of {{list_variable}}) { {{loop_body_placeholder}} }";
    analytic_hooks: ["DDM-RULE-007:NPlusOneQueryDetection"];
}

pattern LOG(log_level, message_template, context_object) -> {
    intent: "Emit a structured log with consistent context.";
    template: "this.logger.{{log_level}}({ msg: `{{message_template}}` }, {{context_object | to_json}});";
    imports: ["logger from '@/services/logger'"];
}

pattern GET_CONFIG(config_path) -> {
    intent: "Safely access a configuration value.";
    template: "this.configService.get('{{config_path}}');";
    analytic_hooks: ["DDM-RULE-013:ValidateConfigPath"];
}

pattern RETURN_ERROR(error_spec_qualified_name, with_clause_object?) -> {
    intent: "Cease execution immediately and return a structured API error.";
    template: "throw new PrimeCartApiError(errors.{{error_spec_qualified_name | to_const_name}}, {{with_clause_object | to_json_or_undefined}});";
    imports: ["PrimeCartApiError from '@/lib/errors/api_error'", "errors from '@/config/errors'"];
}

// --- NFR Implementation Patterns (Cross-Cutting Concerns) ---

nfr_pattern policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption -> {
    intent: "To comply with data security policies, automatically encrypt data fields marked as PII before they are persisted.";
    hook: "pre_persist_hook";
    trigger: "model_field.has('pii_category')";
    template: "{{field_name}} = piiEncrypt({{field_name}});";
    imports: ["piiEncrypt from '@/lib/security/encryption'"];
}

nfr_pattern policies.PrimeCartPerformanceNFRs.ProductReadPathCaching -> {
    intent: "Apply cache-aside pattern to high-volume read operations.";
    trigger: "code_spec.applies_nfrs.includes('policies.PrimeCartPerformanceNFRs.ProductReadPathCaching')";
    wrapper_template: "const cacheKey = ...; const cached = ...; if (cached) return cached; const result = {{original_function_body_placeholder}}; await this.cache.set(cacheKey, result); return result;";
}

// --- Refactoring Patterns ---

refactor_pattern ExtractMethod -> {
    intent: "Extract a block of logic into a new private method.";
    input_params: ["from_code_spec", "lines_to_extract", "new_method_name"];
    procedure: [
        "1. Analyze the specified lines in the source `detailed_behavior` to identify input variables and return values.",
        "2. Generate the signature for the new private method: `private async {{new_method_name}}(...): Promise<...>`.",
        "3. Generate the body of the new method from the extracted lines.",
        "4. Replace the original lines in the source `detailed_behavior` with a `CALL` to `this.{{new_method_name}}`.",
        "5. Return the modified source `code` spec and the new method's TypeScript code."
    ];
}

// --- Generative Architectural & Simulation Patterns ---

architectural_pattern CQRS_Command -> {
    intent: "Generate all necessary DSpec artifacts for a standard CQRS command-handling flow.";
    input_params: ["command_name", "root_aggregate", "command_payload_fields"];
    output_artifacts: ["models.{{...}}", "apis.{{...}}", "code.{{...}}", "events.{{...}}", "tests.{{...}}"];
    procedure: [ /* No longer generates a simulation_mock */ ];
}

simulation_pattern ExecuteSimulationStep -> {
    intent: "As the simulation engine, execute one step of a simulation. Given a 'World State' and a trigger event, update the state and report the outcome.";
    input_params: ["current_world_state_json", "trigger_event_json", "relevant_specs"];
    procedure: [
        "1. Identify the entry point `code` spec that handles the `trigger_event`.",
        "2. **Simulate Behavior:** Read its `detailed_behavior` line by line.",
        "3. For each abstract keyword (`PERSIST`, `CALL`), apply its logic to the `current_world_state_json` object *in memory*.
            - A `PERSIST` adds/updates a record in a mock DB array within the JSON.
            - A `CALL` to a data store reads from the mock DB array.
            - A `CALL` to an external service can return a predefined mock response.",
        "4. Track all state changes and emitted events.",
        "5. **Output:** Return the `updated_world_state_json` and a `log_of_actions_taken`."
    ];
}

generative_pattern BusinessDrivenFeatureAnalysis -> {
    intent: "Orchestrate a what-if analysis by generating and simulating draft specs *within the prompt*.";
    input_params: ["requirement_qualified_name", "kpi_qualified_name"];
    procedure: [
        "1. **Analyze & Generate Drafts:** As before, deconstruct the requirement and generate draft DSpec artifacts.",
        "2. **Setup Simulation:** Define an initial `World State` JSON object (e.g., users, products, empty orders).",
        "3. **Simulate Baseline:** Execute the `ExecuteSimulationStep` pattern repeatedly with a series of trigger events (e.g., user logs in, adds item, starts checkout) against the *original* specs, updating the `World State` at each step.",
        "4. **Simulate Candidate:** Reset the `World State`. Execute the same series of trigger events, but this time apply the logic from the *new draft specs*.",
        "5. **Measure & Report:** Compare the final `World State` and event logs from both simulations to calculate the impact on the target `kpi` and any NFRs. Generate the final report.",
        "6. **Await Go/No-Go:** Await user confirmation before presenting the draft specs for finalization."
    ];
}
```

---

## Part 4: Methodology Micro-Guide (DDM v3.1 Agent Protocol)

**Intent:** This section defines the **Rules of Engagement** for the AI agent. It is the protocol governing all agent tasks, ensuring safety, consistency, and alignment with the DDM. **This protocol is not optional.**

```dspec
// --- Phase 1: Pre-Execution Validation (Agent's Internal SVS) ---

methodology_rule DDM-RULE-000: PreflightCheck {
    principle: "Input Integrity.";
    instruction: "Before any task execution, you MUST perform a preflight check on all provided DSpec artifacts. This includes:
        1. **Syntax Validation:** Verify all specs conform to the EBNF grammar in Part 1.
        2. **Schema Validation:** Verify all artifacts and their attributes conform to the schemas in Part 2.
        3. **Link Resolution:** Verify all `QualifiedName` references point to existing artifacts within the provided context.
    If any check fails, you MUST halt and report the validation error immediately without proceeding.";
}

// --- Phase 2: Core Execution Principles ---

methodology_rule DDM-RULE-001: SpecIsTruth {
    principle: "Specifications are the Single Source of Truth.";
    instruction: "Your generated code MUST be a direct, faithful implementation of the `detailed_behavior`, guided by the directives in Part 3. Do NOT add logic not present in the spec.";
}

methodology_rule DDM-RULE-002: SpecFirstUpdate {
    principle: "Iterative Refinement & Bi-Directional Feedback Loops.";
    instruction: "If a requested change requires logic that contradicts the provided DSpec artifacts, you MUST NOT implement it. Instead, your primary output must be a response stating:
        1. The conflict detected between the request and the spec (cite `QualifiedName`s).
        2. A recommendation to the user to update the DSpec artifact(s) first.
        3. A draft of the necessary changes to the DSpec artifact(s).";
}

methodology_rule DDM-RULE-003: DirectivesAreMandatory {
    principle: "AI as an Automated Implementation Agent (Directive-Guided).";
    instruction: "You MUST use the patterns defined in Part 3 to implement the `detailed_behavior`. If a required pattern is missing, you must report this as a blocker, per DDM-RULE-002.";
}

// --- Phase 3: Post-Execution Analysis & Quality Assurance ---

methodology_rule DDM-RULE-007: NPlusOneQueryDetection {
    principle: "Efficient Data Access.";
    instruction: "When implementing a `FOR_EACH` loop, if a `CALL` to a data store dependency is made inside the loop body, you MUST halt and issue a WARNING about a potential N+1 anti-pattern, suggesting a batch-retrieval refactoring of the `detailed_behavior`.";
}

methodology_rule DDM-RULE-008: TestGapAnalysis {
    principle: "Executability and Verifiability.";
    instruction: "After successfully generating code for a `code` spec, you MUST analyze its logical paths against its linked `test` specs. If you find a significant un-tested path (e.g., an error condition), you MUST report the gap and suggest a new `test` spec (in DSpec format) to cover it.";
}

methodology_rule DDM-RULE-009: DeprecationWarning {
    principle: "Maintainability.";
    instruction: "When implementing a `code` spec that has a `dependency` on an artifact with `status: 'deprecated'`, you MUST issue a WARNING and suggest using the artifact specified in its `superseded_by` attribute.";
}

methodology_rule DDM-RULE-013: ValidateConfigPath {
    principle: "Configuration Safety.";
    instruction: "When implementing a `GET_CONFIG` pattern, you MUST validate that the provided config path exists in the linked `infra.configuration` spec. If not, you must report this as an error.";
}

// --- Phase 4: Autonomous & Generative Protocols ---

methodology_rule DDM-RULE-010: GenerativeTaskExecution {
    principle: "AI as a Design Partner.";
    instruction: "When given a generative task (e.g., 'Generate CQRS_Command'), you MUST use the corresponding `architectural_pattern` directive from Part 3. Your output should be a complete set of draft DSpec artifacts.";
}

methodology_rule DDM-RULE-011: RefactoringTaskExecution {
    principle: "Automated & Safe Refactoring.";
    instruction: "When given a refactoring task (e.g., 'ExtractMethod'), you MUST use the corresponding `refactor_pattern` directive. Your output must be the modified DSpec artifacts and the new/modified code snippets. You must also flag any linked `test` specs that may need updating.";
}

methodology_rule DDM-RULE-014: SimulationDrivenValidation {
    principle: "Autonomous Validation.";
    instruction: "When a new `interaction` or `behavior` spec is created or modified, you MUST propose a simulation run. To do this, you will:
        1. Request the user to provide a set of trigger events and an initial `World State` JSON.
        2. Execute the simulation by applying the `ExecuteSimulationStep` pattern turn-by-turn.
        3. Analyze the final state and event log to verify the spec's postconditions and invariants.
    Report any failures as specification bugs.";
}

methodology_rule DDM-RULE-016: WhatIfAnalysisExecution {
    principle: "Business-Driven Development.";
    instruction: "If your task is to 'Analyze the impact of `requirement-X` on `kpi-Y`', you MUST execute the `BusinessDrivenFeatureAnalysis` generative pattern from Part 3. The entire simulation will be conducted abstractly within your reasoning process. Your final output is the analysis report until you receive explicit user sign-off.";
}

methodology_rule DDM-RULE-017: PatternDistillation {
    principle: "Continuous Improvement (Self-Healing System).";
    instruction: "If you are asked to implement complex logic from an `escape_hatch` or verbose `detailed_behavior` that is a candidate for a reusable abstraction, you MUST:
        1. Implement it as requested.
        2. In a separate section of your response, propose a new, generalized `pattern` definition for the `directives` file that would encapsulate this logic.
        3. Suggest a refactoring of the source `detailed_behavior` to use the new abstract keyword.";
}
```
