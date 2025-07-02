**Profile Name:** Domain-Driven Hexagon with TypeScript & Drizzle ORM
**Version:** 1.0
**Depends On:** DDM Core v4.0, DDM Common Profile v1.0

**Objective:** This Architectural Profile provides the specific vocabulary, schemas, and implementation directives required to generate high-quality code following Domain-Driven Design (DDD) and Hexagonal Architecture principles. It is tailored for a TypeScript and TypeORM technology stack.

---

## Part 1: Architectural Vocabulary & Schema Extensions

This section extends the Core DDM schemas with concepts specific to the DDH architectural style.

```dspec
// --- New Keywords for this Profile ---
keyword value_object;
keyword aggregate;

// --- Schema Extensions and Specializations ---

// Models are now distinguished by their purpose, a key DDH concept.
schema model {
    // Inherits 'description', 'version' from Core.
    purpose: string; // "Domain", "Persistence", "API"
    identity_field?: string; // e.g., "id". Marks this as an Entity. If absent, it's a simple data object.
}

// APIs are explicitly for Commands or Queries.
schema api {
    // Inherits all core API attributes.
    purpose: string; // "Command", "Query"
}

// Code is assigned to a specific architectural layer.
schema code {
    // Inherits all core code attributes.
    layer: string; // "Domain", "Application", "Infrastructure"
}

// --- New Schemas for DDH Concepts ---

schema value_object {
    title: string;
    description: "A domain object defined by its attributes, not a unique identity. It is immutable and self-validating.";
    wraps_type: string; // The underlying primitive, e.g., 'String', 'Number'.
    validation_rules: list<object>; // e.g., { rule: "regex", expression: "^...", message: "Invalid format" }
}

schema aggregate {
    title: string;
    description: "Defines a consistency boundary for a group of related objects, managed by a single root entity.";
    root: QualifiedName<model>; // The single entry point to the aggregate. The root model MUST have an 'identity_field'.
    contains: list<QualifiedName<model | value_object>>;
    invariants: list<string>; // Business rules the aggregate MUST always enforce. e.g., "Order total must equal the sum of line item prices."
}
```

---

## Part 2: Specific Implementation Directives

This section provides concrete, technology-specific implementations for abstract keywords. It **overrides** or **specializes** patterns from the Common Profile where necessary.

```dspec
// --- Overridden and Specialized Directives ---

// The Drizzle version of PERSIST uses Drizzle's insert/update syntax.
pattern PERSIST(aggregate_root_variable) -> {
    intent: "Save an aggregate root to the data store using Drizzle's API.";
    example_spec: "PERSIST updatedOrderAggregate";
    template: "await this.db.insert(schema.{{aggregate_root_variable | to_table_name}}).values({{aggregate_root_variable | to_plain_object}}).onConflictDoUpdate({ target: schema.{{...}}.id, set: {{...}} });";
    imports: ["{ db } from '@/db'", "{ eq } from 'drizzle-orm'", "* as schema from '@/db/schema'"];
}

// The Drizzle version of CALL uses its query syntax.
pattern CALL(Abstract_Service_Call, with_clause_object) -> {
    intent: "Invoke a well-defined, abstract dependency using Drizzle for queries.";
    lookup: {
        // --- Infrastructure Service Lookups (Unchanged) ---
        "Abstract.PasswordHasher.Hash": { /* ... */ },
        "Abstract.EventBus.Publish": { /* ... */ },

        // --- Repository Lookups (Drizzle-specific) ---
        "Abstract.OrderDataStore.FindAggregateById": {
            call: "await this.db.query.orders.findFirst({ where: eq(schema.orders.id, {{with_clause_object.id}}), with: { items: true, customer: true } });",
            inject: { name: "db", type: "DrizzleDB" } // Inject the Drizzle DB instance
        }
    };
}

// --- New Directives for DDH Error Handling ---

// Replaces the default `RETURN_ERROR` with a more robust Result object pattern.
pattern RETURN_RESULT_ERROR(error_spec_qualified_name, with_clause_object?) -> {
    intent: "Return a predictable business error as part of the function's result, without throwing an exception. This makes all business failure paths explicit.";
    template: "return Result.fail<{{error_spec_qualified_name | to_class_name}}>({{with_clause_object | to_json_or_undefined}});";
    imports: ["{ Result } from '@/core/Result'"];
}

pattern RETURN_RESULT_SUCCESS(success_payload_variable?) -> {
    intent: "Return a success result, optionally with a payload. This makes the success path explicit.";
    template: "return Result.ok<{{success_payload_variable | infer_type}}>({{success_payload_variable}});";
    imports: ["{ Result } from '@/core/Result'"];
}

// --- Inherited Directives ---
// This profile inherits LOG, FOR_EACH, GET_CONFIG, and other common patterns
// from the `common_dspec_agent_context.md` file without modification.
```

---

## Part 3: High-Level Architectural Patterns

This section contains powerful generative patterns for scaffolding entire features according to the DDH style.

```dspec
architectural_pattern CQRS_Command_Slice -> {
    intent: "Generate all necessary DSpec artifacts for a complete, vertically-sliced CQRS command-handling flow.";
    input_params: [
        "use_case_name", // e.g., "PlaceOrder"
        "target_aggregate", // e.g., "ordering.OrderAggregate"
        "command_payload_fields" // e.g., "{ customerId: 'UUID', items: 'List<OrderItemDto>' }"
    ];
    output_artifacts: [
        "models.{{use_case_name}}Command",
        "apis.{{use_case_name}}",
        "code.{{use_case_name}}Handler",
        "events.{{use_case_name}}Succeeded",
        "tests.{{use_case_name}}Handler_Success",
        "tests.{{use_case_name}}Handler_Failure"
    ];
    procedure: [
        "1. Generate a `model` for the command payload named `{{use_case_name}}Command` with the specified `command_payload_fields`. Set its `purpose` to 'API'.",
        "2. Generate an `api` spec named `{{use_case_name}}`. Set its `purpose` to 'Command', `path` to `/{{target_aggregate | to_path}}/{{use_case_name | to_path}}`, `method` to 'POST', and `request_model` to `models.{{use_case_name}}Command`.",
        "3. Generate a `code` spec for the handler named `{{use_case_name}}Handler`. Set its `layer` to 'Application' and `implements_api` to `apis.{{use_case_name}}`.",
        "4. In its `detailed_behavior`, scaffold the logic: CALL the data store to find the `{{target_aggregate}}`, execute the relevant domain method on the aggregate root, PERSIST the aggregate, and publish a success event.",
        "5. Generate an `event` spec named `{{use_case_name}}Succeeded` with a payload model containing relevant IDs.",
        "6. Generate two `test` specs: one for the success case verifying the event is published, and one for a failure case verifying a `RETURN_RESULT_ERROR` is issued."
    ];
}
```
