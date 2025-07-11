# PrimeCart E-Commerce App: A DefinitiveSpec User Guide

**Welcome to the PrimeCart DefinitiveSpec Guide!**

This guide demonstrates how to use DefinitiveSpec and the conceptual DefinitiveSpec Tools for VS Code to specify key aspects of the "PrimeCart" e-commerce application, a platform built primarily with TypeScript. We will cover everything from high-level requirements to detailed API contracts, data models, behavioral specifications (including state machines, interactions, and formal models), operational policies, and test cases.

This guide also illustrates how DSpec artifacts are designed to be effectively utilized by **LLM-based co-pilots** for specification assistance and by **AI implementation agents** for robust code generation, with humans focusing on review and validation of intent. These practices are integral to the broader **Definitive Development Methodology (DDM)**, which provides a structured, iterative approach to software development. Core DDM principles, its lifecycle, and other related concepts are detailed in the Appendices of this document (not included in this rendering).

**Target Audience:** Developers, QAs, Product Owners, and Architects working on the PrimeCart application using DefinitiveSpec and, ideally, within the Definitive Development Methodology (DDM), leveraging AI tooling.

**Prerequisites:**

*   VS Code installed.
*   "DefinitiveSpec Tools for VS Code" extension installed (conceptual for this guide).
*   Basic understanding of e-commerce concepts.
*   (For Formal Modeling section) Conceptual familiarity with TLA+ or similar formal methods.
*   Familiarity with the Definitive Development Methodology (DDM) is beneficial (see Appendices, not included here).

---

## Chapter 1: Project Setup & Core Requirements (Illustrating DDM Stage 1: Inception)

### 1.1. Setting Up the PrimeCart Specs Project

1.  Create a project folder: `primecart-specs`.
2.  Open it in VS Code.
3.  We'll organize specs into files like `users.dspec`, `products.dspec`, `orders.dspec`, `checkout.dspec`, `interactions.dspec`, `shared_policies.dspec`, `directives.dspec`, `infra.dspec`.
    *   **DDM Note:** In a full DDM setup, these `.dspec` files would be stored, versioned, and managed by the **Specification Hub (ISE)**, which maintains the crucial link graph between all specifications. The ISE resolves local artifact names (e.g., `UserRegistration`) to globally qualified names (e.g., `users.UserRegistration`) for unique identification and linking.

### 1.2. Defining Core User Requirements (`users.dspec`)

Let's start with user registration and login, key outputs of the DDM's Inception stage.

```definitive_spec
// Defines requirements, data models, APIs, and core logic for user management.

requirement UserRegistration {
    // Qualified Name (resolved by ISE): users.UserRegistration
    // id: "PC_REQ_USER_001" // Optional: Retain if this specific ID is used by external systems (e.g., Jira).
    title: "New User Account Registration"
    description: `
        **Goal:** Enable new visitors to create a PrimeCart account.
        **User Story:** As a new visitor to PrimeCart, I want to be able to register for an account using my email and a secure password, so that I can make purchases and track my orders.
        **Core Functionality:**
        1. Accept user input: email, password, password confirmation.
        2. Validate input according to defined rules (email format, password strength - see users.UserRegistrationPayload).
        3. Ensure email uniqueness within the system (see code.HandleUserRegistration).
        4. Securely store user credentials according to NFRs like policies.PrimeCartDataSecurityNFRs.SecurePasswordHashing and policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption.
        5. Provide clear feedback on success or failure of the registration attempt.
        6. Trigger a confirmation email upon successful registration (see event.UserRegistered).
        **Business Value:** Essential for acquiring new customers and enabling e-commerce transactions.
    `
    priority: "High"
    status: "Accepted"
    acceptance_criteria: [
        "Given I am on the registration page",
        "When I enter a unique email 'newuser@example.com'",
        "And I enter a strong password 'ValidPass123!' (matching users.UserRegistrationPayload.password constraints)",
        "And I confirm the password 'ValidPass123!'",
        "And I click the 'Register' button",
        "Then my account should be created successfully",
        "And I should be redirected to the login page or my account dashboard",
        "And I should receive an email confirming my registration."
    ]
    source: "Product Roadmap Q1 - User Features"
    // PGT Hint: This detailed description aids LLMs in understanding scope when drafting linked artifacts like APIs or code specs.
}

requirement UserLogin {
    // Qualified Name: users.UserLogin
    title: "Existing User Login"
    description: `
        **Goal:** Allow registered users to access their PrimeCart accounts.
        **User Story:** As a registered PrimeCart user, I want to log in with my email and password, so that I can access my account, view past orders, and make new purchases.
        **Core Functionality:**
        1. Accept user credentials: email and password.
        2. Validate credentials against stored, secured user data.
        3. Establish a secure session upon successful authentication.
        4. Provide clear feedback on success or failure.
    `
    priority: "High"
    status: "Accepted"
    acceptance_criteria: [
        "Given I am a registered user with email 'user@example.com' and password 'Pass123!'",
        "And I am on the login page",
        "When I enter my email 'user@example.com' and password 'Pass123!'",
        "And I click the 'Login' button",
        "Then I should be successfully authenticated",
        "And I should be redirected to my account dashboard.",
        "And a new session token should be issued."
    ]
    source: "Product Roadmap Q1 - User Features"
}

*   **DDM Note:** For broader, cross-cutting Non-Functional Requirements like "The application must support internationalization (i18n)," a top-level `requirement` artifact should be created. This requirement would then be fulfilled by multiple `design` and `code` specifications, and its implementation strategy would be detailed in project-wide `directive`s for text externalization and locale handling.

```
*   **Tooling Tip:** Use autocompletion for attributes like `priority` and `status`. The (conceptual) DefinitiveSpec Tools LDE highlights Gherkin keywords in `acceptance_criteria`.
*   **DDM Note:** The **Prompt Generation Toolkit (PGT)** could assist a Specification Author in drafting these requirements and acceptance criteria.

---

## Chapter 2: Designing the User Service (Illustrating DDM Stage 2: Design & Detailed Specification)

Now, let's design the components, data models, and APIs for user management. This aligns with the DDM's Design and Detailed Specification stage.

### 2.1. User Service Design Component (`users.dspec`)

```definitive_spec
// users.dspec (continued)

design UserService { // This 'design' artifact represents a logical component or microservice.
    // Qualified Name: users.UserService
    title: "User Management Component"
    description: `A logical component responsible for all aspects of user account management,
        including registration, authentication, profile management, and password recovery.
        It interacts with an abstract User Data Store and utilizes shared security components.
    `
    responsibilities: [
        "Handle new user registrations (see code.users.HandleUserRegistration).",
        "Authenticate existing users (see code.users.HandleUserLogin).",
        "Store and manage user profile data securely, adhering to NFR policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption.",
        "Manage user sessions and JWT generation."
    ]
    fulfills: [users.UserRegistration, users.UserLogin] // Referencing by qualified name
    // SVS Rule: `fulfills` and `dependencies` must link to existing, valid qualified artifact names.
}
```
*   **DDM Note:** Attributes like `fulfills` and `dependencies` are crucial for the DDM principle of **Structure and Interconnectivity**, managed by the ISE.

### 2.2. Data Models for User Operations (`users.dspec`)

```definitive_spec
// users.dspec (continued)

model UserRegistrationPayload {
    // Qualified Name: users.UserRegistrationPayload
    description: "Data payload for new user registration. Constraints are enforced by the API gateway/framework based on these definitions."
    email: String {
        description: "User's email address. Must be unique system-wide.";
        format: "email";
        required: true;
        maxLength: 255;
        pii_category: "ContactInfo";
    }
    password: String {
        description: "User's desired password. Must meet strength requirements.";
        minLength: 10;
        // Example: At least 1 uppercase, 1 lowercase, 1 digit.
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{10,}$";
        required: true;
        // Hashing is the primary protection, but category helps policies.
        pii_category: "Credentials";
    }
    password_confirm: String {
        description: "Confirmation of the password. Must match 'password' field.";
        required: true;
        // The business rule for matching 'password' is handled in the `code` spec, not as a schema constraint.
    }
    full_name: String { required: true; maxLength: 100; pii_category: "ContactInfo"; }
}

model UserLoginPayload {
    // Qualified Name: users.UserLoginPayload
    description: "Data payload for user login."
    email: String { format: "email"; required: true; }
    password: String { minLength: 1; required: true; }
}

model UserProfileResponse {
    // Qualified Name: users.UserProfileResponse
    description: "Represents a user's profile data returned by the API or used in events."
    user_id: String { format: "uuid"; description: "Unique identifier for the user."; }
    email: String { format: "email"; required: true; pii_category: "ContactInfo"; }
    full_name?: String { pii_category: "ContactInfo"; }
    registration_date: DateTime { required: true; }
}

// This should ideally be in a shared models file, e.g., shared.dspec
model ErrorResponseMessage {
    // Qualified Name: users.ErrorResponseMessage (or better: shared.ErrorResponseMessage)
    description: "Standard error response structure for failed API operations."
    error_code: String { description: "A machine-readable error code (e.g., from policies.ErrorCatalog)."; required: true; }
    message: String { description: "A human-readable error message."; required: true; }
    details?: List<String> { description: "Optional additional details about the error."; }
}

// --- Standardized API Result Models ---
model UserRegistrationSuccessData {
    // Qualified Name: users.UserRegistrationSuccessData
    description: "Data returned upon successful user registration."
    user_id: String { format: "uuid"; required: true; }
    email: String { format: "email"; required: true; }
    // SVS Rule: All fields should conform to their model definitions.
}

model UserRegistrationResult {
    // Qualified Name: users.UserRegistrationResult
    description: "Outcome of a user registration attempt. Represents a discriminated union based on 'status'."
    status: enum {"success", "failure"} { required: true; description: "Discriminator for the result type." }
    success_data?: users.UserRegistrationSuccessData { description: "Present if status is 'success'." }
    error_data?: users.ErrorResponseMessage { description: "Present if status is 'failure'." }
    // SVS Rule: Based on 'status', exactly one of 'success_data' or 'error_data' MUST be present.
}

model AuthSuccessData {
    // Qualified Name: users.AuthSuccessData
    description: "Data returned upon successful authentication."
    session_token: String { description: "JWT for the user session."; required: true; }
    // This demonstrates model composition, where the 'user_profile' field's type
    // is another defined model. SVS validates this link.
    user_profile: users.UserProfileResponse { required: true; }
}

model AuthResult {
    // Qualified Name: users.AuthResult
    description: "Outcome of a user login attempt."
    status: enum {"success", "failure"} { required: true; description: "Discriminator for the result type." }
    success_data?: users.AuthSuccessData { description: "Present if status is 'success'." }
    error_data?: users.ErrorResponseMessage { description: "Present if status is 'failure'." }
    // SVS Rule: Discriminated union consistency check.
}

// Internal Data Store Model (example, not directly exposed via API)
model UserEntity {
    // Qualified Name: users.UserEntity
    description: "Internal representation of a user in the data store (e.g., a database table)."
    user_id: String { format: "uuid"; required: true; } // Hint for ORM: primary_key
    email: String { format: "email"; required: true; pii_category: "ContactInfo"; } // Hint for ORM: unique
    hashed_password: String { required: true; pii_category: "Credentials"; }
    full_name?: String { pii_category: "ContactInfo"; }
    created_at: DateTime { required: true; }
    updated_at: DateTime { required: true; }
}
```
*   **Tooling Tip:** The DefinitiveSpec Tools LDE can provide autocompletion for JSON Schema-aligned constraint keywords. The `pii_category` is a custom attribute used by policies and directives.
*   **DDM Note:** These `model` artifacts can be used by the **Specification Validation Suite (SVS)** for schema validation and by the **AI Implementation Agent** (guided by `directive`s) for generating TypeScript interfaces, validation code, and ORM entities.

### 2.3. APIs for User Service (`users.dspec`)

```definitive_spec
// users.dspec (continued)

api RegisterUser {
    // Qualified Name: users.RegisterUser
    title: "Register New User"
    summary: "Creates a new user account."
    operationId: "registerUser"
    description: "Endpoint for new user registration. Adheres to global API policies for error handling and security."
    part_of: users.UserService // Links to the design component by qualified name
    path: "/v1/users/register"
    version: "1.0.0"
    method: "POST"
    tags: ["UserManagement", "Authentication"]
    request_model: users.UserRegistrationPayload
    response_model: users.UserRegistrationResult // Standardized result model
    response_status_map: { // Explicit mapping from response_model status/error_code to HTTP status
        "success": 201, // From UserRegistrationResult.status
        "failure": { // Maps from error_data.error_code in the response model
            "PC_ERR_VALIDATION": 400,
            "PC_ERR_USER_EMAIL_IN_USE": 409,
            "default": 500 // Fallback for other failure types
        }
    }
    // DDM Note: The AI Implementation Agent, guided by a directive, will map the response_model's 'status' field
    // to appropriate HTTP status codes (e.g., 'success' -> 201, 'failure' with a 'PC_ERR_USER_EMAIL_IN_USE' code -> 409).
    security_scheme: [policies.CoreSecurityPolicies.WebApplicationSecurity.PublicApi] // Assuming a PublicApi scheme is defined
    // SVS Rule: `request_model` and `response_model` must be valid, qualified model names.
}

api LoginUser {
    // Qualified Name: users.LoginUser
    title: "Login Existing User"
    summary: "Authenticates an existing user and returns a session token."
    operationId: "loginUser"
    part_of: users.UserService
    version: "1.0.0"
    path: "/v1/users/login"
    method: "POST"
    tags: ["UserManagement", "Authentication"]
    request_model: users.UserLoginPayload
    response_model: users.AuthResult // Standardized result model
    // PGT Hint: LLM can use `request_model` and `response_model` to generate client/server stubs and API documentation.
}
```
---

## Chapter 3: Specifying Core Logic (Illustrating DDM Stage 2: Detailed Specification)

Let's define the `code` artifact for handling user registration. This detailed, abstract behavioral specification is a key input for the **AI Implementation Agent**.

### 3.1. User Registration Code Specification (`users.dspec`)

```definitive_spec
// users.dspec (continued)

code HandleUserRegistration {
    // Qualified Name: users.HandleUserRegistration
    title: "Core Logic for User Registration Process"
    description: "Implements the business logic for registering a new user, including validation, data persistence, and event emission."
    implements_api: users.RegisterUser // Links to the API contract this code fulfills
    part_of_design: users.UserService // Links to the logical design component

    language: "TypeScript" // Target language for the AI Implementation Agent

    implementation_location: {
        filepath: "primecart-app/src/modules/users/handlers/registration_handler.ts",
        entry_point_name: "handleUserRegistrationLogic",
        // SVS Rule: `filepath` should be a valid path relative to project root.
        // IDE Agent: Uses this to link directly to the code and detect spec-code drift.
    }

    signature: "async function (payload: users.UserRegistrationPayload): Promise<users.UserRegistrationResult>"
    preconditions: [
        "Input `payload` has passed schema validation against `users.UserRegistrationPayload` (performed by API framework).",
        "Dependencies (UserDataStore, PasswordHasher, EventPublisher) are available/injected based on the `dependencies` list and directives."
    ]
    postconditions: [
        "If successful, a new user record is created in the User Data Store.",
        "If successful, a `users.UserRegistrationResult` with status 'success' is returned.",
        "If email already exists, a `users.UserRegistrationResult` with status 'failure' and an `EmailAlreadyInUse` error is returned.",
        "If password hashing fails, a `users.UserRegistrationResult` with status 'failure' and an `InternalServerError` is returned.",
        "If successful, an `events.UserRegistered` event is emitted."
    ]

    detailed_behavior: `
        // AI Implementation Agent Target: Translate this abstract business logic into TypeScript.
        // Human Review Focus: Correctness of this core registration sequence, data handling, and adherence to pre/postconditions.

        // 1. Business Rule Validation
        IF payload.password NOT_EQUALS payload.password_confirm THEN
            // The directive for error handling will map this to the correct error object construction.
            RETURN_ERROR policies.GlobalAPIPolicies.PrimeCartErrorCatalog.ValidationFailed WITH { message: "Passwords do not match." }
        END_IF

        // 2. Check Email Uniqueness (Abstract Data Operation)
        DECLARE existingUser AS OPTIONAL users.UserEntity
        // 'Abstract.UserDataStore' is an abstract dependency. The directive will map this
        // to a specific TypeORM call.
        CALL Abstract.UserDataStore.CheckByEmail WITH { email: payload.email } RETURNING existingUser

        IF existingUser IS_PRESENT THEN
            RETURN_ERROR policies.GlobalAPIPolicies.PrimeCartErrorCatalog.EmailAlreadyInUse
        END_IF

        // 3. Prepare User Entity (Abstract Service Call)
        DECLARE hashedPassword AS String
        // 'Abstract.PasswordHasher.Hash' is an abstract dependency.
        CALL Abstract.PasswordHasher.Hash WITH { password: payload.password } RETURNING hashedPassword
            ON_FAILURE RETURN_ERROR policies.GlobalAPIPolicies.PrimeCartErrorCatalog.InternalServerError

        DECLARE newUserEntity AS users.UserEntity
        // The AI Implementation Agent will automatically apply encryption logic here based on the
        // `policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption` NFR policy and its corresponding
        // pattern in the `directives.dspec` file, because model fields are marked with `pii_category`.
        CREATE_INSTANCE users.UserEntity WITH {
            email: payload.email,
            hashed_password: hashedPassword,
            full_name: payload.full_name,
            created_at: System.CurrentUTCDateTime, // Another abstract call
            updated_at: System.CurrentUTCDateTime
        } ASSIGN_TO newUserEntity

        // 4. Persist User
        DECLARE persistedUser AS users.UserEntity
        PERSIST newUserEntity TO Abstract.UserDataStore RETURNING persistedUser
            ON_FAILURE RETURN_ERROR policies.GlobalAPIPolicies.PrimeCartErrorCatalog.DatabaseError

        // 5. Emit Event (Abstract Event Operation)
        DECLARE eventPayload AS models.UserRegisteredEventPayload // Assuming a model for the event payload
        CREATE_INSTANCE models.UserRegisteredEventPayload FROM persistedUser ASSIGN_TO eventPayload
        EMIT_EVENT events.UserRegistered WITH { payload: eventPayload } VIA Abstract.EventPublisher

        // 6. Construct and Return Success Response
        DECLARE successDataPayload AS users.UserRegistrationSuccessData
        CREATE_INSTANCE users.UserRegistrationSuccessData FROM persistedUser ASSIGN_TO successDataPayload
        RETURN_SUCCESS successDataPayload // This implicitly creates users.UserRegistrationResult with status 'success'
    `
    // This defines the complete error contract for this code unit.
    throws_errors: [
        policies.GlobalAPIPolicies.PrimeCartErrorCatalog.ValidationFailed,
        policies.GlobalAPIPolicies.PrimeCartErrorCatalog.EmailAlreadyInUse,
        policies.GlobalAPIPolicies.PrimeCartErrorCatalog.InternalServerError,
        policies.GlobalAPIPolicies.PrimeCartErrorCatalog.DatabaseError
    ]
    dependencies: [ // Abstract dependencies; directives map these to concrete implementations.
        "Abstract.UserDataStore",
        "Abstract.PasswordHasher",
        "Abstract.EventPublisher",
        "Abstract.SystemDateTimeProvider" // For System.CurrentUTCDateTime
    ]
    // SVS Rule: `implements_api` must link to an existing API. `signature` return type must match API's `response_model`.
    // SVS Rule: All qualified names (e.g. users.ModelName, policies.ErrorName, events.EventName) must be valid, defined artifact identifiers.
}
```
*   **DDM Note:** The abstract `detailed_behavior` exemplifies **Precision and Unambiguity** for the AI. The PGT can help draft this from higher-level specs. Human review focuses on the logical flow. The **AI Implementation Agent** relies on `directive`s to translate abstract operations like `CALL` and `PERSIST` into concrete code.

---

## Chapter 3A: Specifying Inter-Component Interactions (Illustrating DDM Stage 2)

The PrimeCart system involves collaborations between different logical components. The `interaction` specification helps model these sequenced exchanges.

> **Why Use an `interaction` Specification?**
>
> While a `code` spec details the logic *inside* a single component, an `interaction` spec models the conversation *between* multiple components. Use it when:
> *   A process involves a sequence of messages across several services.
> *   You need to define a complex asynchronous workflow (e.g., request-reply, publish-subscribe).
> *   The correct ordering of calls is critical to the business logic.
>
> It provides a "bird's-eye view" of the choreography that individual `code` specs cannot.


### 3A.1. PrimeCart Tool Call Processing Interaction (`interactions.dspec`)

This example, while not directly part of core e-commerce, illustrates how DSpec can model complex internal workflows, such as if PrimeCart used an internal LLM agent for advanced tasks (e.g., dynamic query generation, spec analysis).

```definitive_spec
// interactions.dspec
// Human Review Focus: Correctness of sequence, component responsibilities, and message content.
// PGT Hint: Use this to generate skeletons for implementing components' roles in the interaction.

interaction PrimeCart_ProcessLlmToolCall {
    // Qualified Name: interactions.PrimeCart_ProcessLlmToolCall
    title: "Sequence for PrimeCart Processing an LLM Tool Call Request"
    description: `
        Details the message exchange when processing a tool call request from an LLM,
        sending it to an orchestration component, and awaiting the result.
    `
    components: [ // These MUST link to qualified `design` artifact names
        designs.LlmGenerationLogic,
        designs.TaskOrchestrationLogic,
        designs.ProductAnalysisToolExecutor // Example specific tool executor
    ]

    message_types: [ // These MUST link to qualified `model` names
        models.LlmToolCallRequestFromAgent, // Payload from LLM with tool name and args (e.g. from a shared models.dspec)
        models.InternalExecuteToolCommand,    // Standardized command for orchestration
        models.InternalToolExecutionResult,   // Standardized result from executor to orchestrator
        models.FinalToolCallResultToAgent     // Standardized result from orchestrator back to generation logic
    ]

    initial_component: designs.LlmGenerationLogic
    // SVS Rule: All `components` and `message_types` must reference valid, qualified artifact names.

    steps: [
        {
            step_id: "S1_LLM_REQUESTS_TOOL"
            component: designs.LlmGenerationLogic
            description: "An external LLM agent provides a `models.LlmToolCallRequestFromAgent`."
            action: "Construct `models.InternalExecuteToolCommand` and dispatch to orchestration."
            sends_message: { to: designs.TaskOrchestrationLogic, message_name: "ExecuteTool", payload_model: models.InternalExecuteToolCommand, delivery: "sync_request_reply" }
            implemented_by_code: code.LlmGenerationLogic.DispatchToolCommand // Optional link to the implementing code spec
        },
        {
            step_id: "S2_ORCHESTRATION_DELEGATES"
            component: designs.TaskOrchestrationLogic
            description: "Receives ExecuteTool message and identifies the target tool executor."
            action: "Route to the appropriate tool executor (e.g., designs.ProductAnalysisToolExecutor)."
            sends_message: {
                to_dynamic_target_from_context: "resolved_tool_executor_component_id" // Placeholder for dynamic routing logic
                message_name: "ExecuteSpecificToolAction",
                payload_model: models.InternalExecuteToolCommand
            }
        },
        {
            step_id: "S3_EXECUTOR_PERFORMS_ACTION"
            component: designs.ProductAnalysisToolExecutor // Example, actual component is dynamic from S4
            description: "Executes the specific tool logic (e.g., analyze product data based on provided arguments)."
            action: "Perform tool logic, detailed in the `code` spec for this executor (e.g., `code.ProductAnalysisToolExecutor.Execute`)."
        },
        {
            step_id: "S4_EXECUTOR_RETURNS_RESULT"
            component: designs.ProductAnalysisToolExecutor
            sends_message: {
                to: designs.TaskOrchestrationLogic,
                message_name: "SpecificToolActionCompleted",
                payload_model: models.InternalToolExecutionResult
            }
        },
        {
            step_id: "S5_ORCHESTRATION_PACKAGES_FINAL_RESULT"
            component: designs.TaskOrchestrationLogic
            description: "Receives result and packages it for the original caller."
            action: "Construct `models.FinalToolCallResultToAgent`."
            // This is the reply to the S1 message.
            sends_reply_for_message_from_step: "S1_LLM_REQUESTS_TOOL"
            with_payload_model: models.FinalToolCallResultToAgent
        },
        {
            step_id: "S6_GENERATION_LOGIC_PROCESSES_RESULT"
            component: designs.LlmGenerationLogic
            // Receives reply from S5.
            guard: "S5.with_payload_model.status == 'success'" // Assuming FinalToolCallResultToAgent has a status
            description: "Processes successful tool result. Prepares result for the LLM agent."
            action: "Format tool result data as a new ChatMessage (role: tool) for the external LLM interface."
            is_endpoint: true // For this specific interaction diagram.
        }
    ]
    // SVS Rule: Graph should be complete (all paths end in `is_endpoint: true`).
    // SVS Rule: `sends_reply_for_message_from_step` must refer to a valid preceding step that used `sync_request_reply`.
}
```

---

## Chapter 4: Behavioral Specifications - Order Checkout FSM (Illustrating DDM Stage 2)

### 4.1. Checkout Process FSM (`checkout.dspec`)
```definitive_spec
// checkout.dspec
// Defines behaviors and tests related to the checkout process.

behavior CheckoutProcess { // Qualified Name: checkout.CheckoutProcess
    title: "Manages the state transitions of the order checkout process."

    fsm MainCheckoutFSM {
        // Qualified Name: checkout.CheckoutProcess.MainFSM
        description: `
            Models the customer's journey through the PrimeCart checkout process,
            from adding items to the cart to successful order placement or abandonment.
            This FSM helps ensure all steps are handled correctly and edge cases considered.
            Human Review Focus: Logical state flow, completeness of states, transitions, and actions.
            LLM Hint: Can be used to generate state handling logic or validate interaction sequences.
        `
        initial: CartNotEmpty // Assumes cart is populated before checkout 'officially' starts

        states: [
            CartNotEmpty { description: "User has items in cart and initiates checkout." },
            ShippingAddressProvided { description: "User has provided or confirmed shipping address." },
            PaymentMethodSelected { description: "User has selected a payment method." },
            PaymentProcessing { description: "Payment is being processed with the gateway." },
            OrderConfirmed { description: "Payment successful, order placed." },
            PaymentFailed { description: "Payment attempt failed." },
            CheckoutAbandoned { description: "User abandoned the checkout process." }
        ]

        transitions: [
            { from: CartNotEmpty, event: "ProceedToShipping", to: ShippingAddressProvided,
              realized_by_interaction: interactions.InitiateShippingStep // Optional link to an interaction spec
            },
            { from: CartNotEmpty, event: "UserAbandons", to: CheckoutAbandoned },

            { from: ShippingAddressProvided, event: "ProceedToPaymentSelection", to: PaymentMethodSelected },

            { from: ShippingAddressProvided, event: "GoBackToCart", to: CartNotEmpty }, // Example of going back

            { from: PaymentMethodSelected, event: "ConfirmAndPay", to: PaymentProcessing, guard: "PaymentMethodIsValid",
              realized_by_interaction: interactions.ProcessPayment, // Links to an interaction spec
              action: "TriggerPaymentProcessing" // Abstract action name
            },

            { from: PaymentProcessing, event: "PaymentGatewaySuccess", to: OrderConfirmed,
              action: ["CreateOrderRecord", "SendOrderConfirmationEmail", "DecrementStock"], // Abstract action names
              // New attribute for direct traceability to implementing code specs.
              realized_by_code: [
                  code.orders.CreateOrderRecordLogic,      // Assumed qualified names for implementing code specs
                  code.notifications.SendOrderConfirmationEmailLogic,
                  code.inventory.DecrementStockLogic
              ],
              on_entry_triggers_interaction: interactions.NotifyOrderConfirmed // Example
            },
            { from: PaymentProcessing, event: "PaymentGatewayFailure", to: PaymentFailed, action: "LogPaymentFailureDetails" },
            { from: PaymentProcessing, event: "PaymentTimeout", to: PaymentFailed, action: "NotifyUserOfTimeout" },

            { from: PaymentFailed, event: "RetryPayment", to: PaymentMethodSelected, guard: "RetryAttemptsRemaining > 0" }
        ]
    }
}
```
*   **Tooling Tip:** The DefinitiveSpec Tools would help validate that `initial`, `from`, and `to` states exist and might offer visualization.
*   **DDM Note:** This FSM supports **Executability and Verifiability**, as it can be used for model-based testing or even to generate state handling code.

### 4.2. Payment Processing Interaction (`interactions.dspec`)

To complement the FSM, we can define a more detailed interaction spec for a critical part of the process, like payment processing. This shows how a single FSM transition (`ConfirmAndPay`) can be realized by a complex choreography.

```definitive_spec
// interactions.dspec

interaction ProcessPayment {
    // Qualified Name: interactions.ProcessPayment
    title: "Orchestrates Payment Processing During Checkout"
    description: `
        Models the sequence of events when a user confirms payment. It involves the Checkout Service,
        an adapter for an external payment gateway, and the Order Service. This interaction
        realizes the 'ConfirmAndPay' transition in the checkout FSM.
    `
    components: [
        designs.CheckoutService,
        designs.PaymentGatewayAdapter,
        designs.OrderService
    ]
    message_types: [
        models.ProcessPaymentCommand, // Contains payment details, cart snapshot
        models.GatewayChargeRequest,
        models.GatewayChargeResponse, // Can be success or failure
        models.CreateOrderFromPaymentCommand
    ]

    steps: [
        { step_id: "S1_CHECKOUT_SENDS_PAYMENT_CMD", component: designs.CheckoutService,
          description: "User clicks 'Confirm & Pay', triggering this interaction.",
          action: "Constructs a models.ProcessPaymentCommand and sends it to the Payment Gateway Adapter.",
          sends_message: { to: designs.PaymentGatewayAdapter, message_name: "ChargeCard", payload_model: models.GatewayChargeRequest, delivery: "sync_request_reply" }
        },
        { step_id: "S2_ADAPTER_RECEIVES_RESULT", component: designs.PaymentGatewayAdapter,
          description: "Receives the sync reply (models.GatewayChargeResponse) from the external gateway.",
          // The reply is sent back to CheckoutService
        },
        { step_id: "S3_CHECKOUT_PROCESSES_RESULT", component: designs.CheckoutService,
          guard: "S2_reply.payload.status == 'SUCCESS'",
          action: "Payment was successful. Construct models.CreateOrderFromPaymentCommand and send to the Order Service to finalize the order.",
          sends_message: { to: designs.OrderService, message_name: "CreateOrder", payload_model: models.CreateOrderFromPaymentCommand, delivery: "async_fire_forget" },
          next_step: "S4_CHECKOUT_EMITS_FSM_SUCCESS"
        },
        // ... other steps for handling S2_reply.payload.status == 'FAILURE'
        { step_id: "S4_CHECKOUT_EMITS_FSM_SUCCESS", component: designs.CheckoutService,
          description: "Triggers the 'PaymentGatewaySuccess' event in the checkout.CheckoutProcess.MainFSM, moving the state to 'OrderConfirmed'.",
          is_endpoint: true
        }
    ]
}
```

---

## Chapter 5: Formal Model for Inventory Consistency (TLA+) (Illustrating DDM Stage 2 & High-Assurance)

PrimeCart needs strong guarantees about inventory consistency during concurrent purchases. We'll outline a `formal_model` for this, assuming an external TLA+ specification. This is particularly relevant for systems with **High-Assurance Requirements** (DDM Applicability).

### 5.1. Inventory Consistency Formal Model (`products.dspec`)

```definitive_spec
// products.dspec
// Defines product-related models, APIs, and behaviors.

behavior InventoryManagement { // Qualified Name: products.InventoryManagement
    title: "Behaviors related to product inventory."

    formal_model InventoryAtomicityAndConsistency {
        // Qualified Name: products.InventoryManagement.InventoryAtomicityAndConsistency
        language: "TLA+"
        path: "formal_models/inventory_consistency.tla" // Path to the .tla file
        description: `
            A TLA+ specification modeling the concurrent operations of checking stock,
            reserving stock during checkout, and decrementing stock upon order confirmation.
            The model aims to prove that stock levels are never negative and that reservations
            are handled atomically to prevent overselling.
        `
        verifies_code: [ // Links to qualified code spec names
            code.ProductService.CheckStockLogic,  // Assuming these code specs exist
            code.ProductService.ReserveStockLogic,
            code.ProductService.CommitStockReductionLogic
        ]
        verification_tool: "TLC Model Checker v2.17"
        verification_properties: [
            "SafetyInvariant_StockNonNegative: Stock[product] >= 0 for all products.",
            "SafetyInvariant_ReservationAtomicity: Reservations do not interleave incorrectly leading to oversell.",
            "Liveness_OrderEventuallyProcessedOrReservationReleased: If stock is available and payment succeeds, an order is eventually confirmed or its stock reservation is released."
        ]
        verification_status: "Verified (as of 2023-11-15, for model parameters up to 3 concurrent users, 5 products)"
        spec_content: \`\`\`tla_summary
            // This is a summary, actual TLA+ is in inventory_consistency.tla
            ----------------------------- MODULE Inventory -----------------------------
            EXTENDS Naturals, FiniteSets, TLC, Sequences

            VARIABLES stock,      \* Current stock level for each product: productID |-> Nat
                      reservations \* Active reservations: productID |-> Seq of reservationIDs

            (* --- Invariants --- *)
            StockNonNegative == \A p \in DOMAIN stock: stock[p] >= 0

            (* --- Actions --- *)
            CheckStock(prod, qty) == /\ stock[prod] >= qty
                                   /\UNCHANGED <<stock, reservations>>

            ReserveStock(prod, qty, resID) ==
                /\ stock[prod] >= qty
                /\ stock' = [stock EXCEPT ![prod] = stock[prod] - qty]
                /\ reservations' = [reservations EXCEPT ![prod] = Append(reservations[prod], resID)]

            (* ... Other actions like CommitReservation, CancelReservation ... *)
            =============================================================================
        \`\`\`
    }
}
```
*   **Workflow with TLA+ (DDM Stages 2-4):**
    1.  (Stage 2) Specification Author drafts this `formal_model` artifact.
    2.  (Stage 2/3) Formal methods expert writes/updates `inventory_consistency.tla`.
    3.  (Stage 4) Expert runs TLC model checker externally as part of verification.
    4.  (Stage 3/5) Expert updates `verification_status` and `verification_properties` in this `.dspec` file based on results. Feedback loops may refine the TLA+ model or related `code` specs.
    5.  The `spec_content` here serves as a quick reference/summary within DefinitiveSpec, managed by the ISE.

---

## Chapter 6: Operational Policies (`shared_policies.dspec`) (Illustrating DDM Stage 2)

We'll define some shared operational policies, which act as cross-cutting specifications.

```definitive_spec
// policies.dspec
// Tooling Note: Artifacts here referenced using qualified names, e.g., policies.GlobalAPIPolicies.PrimeCartErrorCatalog
```

### 6.1. Standard Error Handling and Catalog

```definitive_spec
// policies.dspec

policy GlobalAPIPolicies { // Qualified Name: policies.GlobalAPIPolicies
    title: "Global policies applicable to all PrimeCart APIs."

    error_catalog PrimeCartErrorCatalog { // Qualified Name: policies.GlobalAPIPolicies.PrimeCartErrorCatalog
        description: "Central catalog of standard error types, their typical HTTP mappings, and log levels for PrimeCart APIs. Used by `RETURN_ERROR` in `code` specs."

        define ValidationFailed {
            // Qualified Name: policies.GlobalAPIPolicies.ErrorCatalog.ValidationFailed
            error_code: "PC_ERR_VALIDATION"
            http_status: 400
            log_level: "Info"
            message_template: "Input validation failed. See 'details' for specific errors."
        }
        define EmailAlreadyInUse {
            error_code: "PC_ERR_USER_EMAIL_IN_USE"
            http_status: 409 // Conflict
            log_level: "Warn"
            message_template: "The email address provided is already associated with an existing account."
        }
        define NotFound {
            error_code: "PC_ERR_NOT_FOUND"
            http_status: 404
            log_level: "Warn"
            message_template: "The resource you requested ('{resource_type}' with ID '{resource_id}') could not be found."
        }
        define UnauthorizedAccess {
            error_code: "PC_ERR_UNAUTHORIZED"
            http_status: 401
            log_level: "Warn"
            message_template: "You are not authenticated to access this resource."
        }
        define ForbiddenAccess {
            error_code: "PC_ERR_FORBIDDEN"
            http_status: 403
            log_level: "Warn"
            message_template: "You do not have permission to perform this action on this resource."
        }
        define InternalServerError {
            error_code: "PC_ERR_INTERNAL_SERVER"
            http_status: 500
            log_level: "Error" // is_retryable is false by default
            message_template: "An unexpected internal error occurred. Trace ID: {trace_id}."
        }
        define DatabaseError {
            error_code: "PC_ERR_DATABASE"
            http_status: 500 // Or 503 if appropriate
            log_level: "Error"
            message_template: "A database operation failed. Trace ID: {trace_id}."
        }
        // SVS Rule: All `error_code`s must be unique. `http_status` should be valid.
    }
}
```

### 6.2. Application Logging Policy

```definitive_spec
// policies.dspec

policy ApplicationMonitoringPolicies { // Qualified Name: policies.ApplicationMonitoringPolicies
    title: "Policies for application logging and monitoring."

    logging PrimeCartLogging { // Qualified Name: policies.ApplicationMonitoringPolicies.PrimeCartLogging
        default_level: "Info" // For production, might be "Warn"
        format: "JSON" // LLM/Directive uses this to structure log output.
        pii_fields_to_mask: [ // Directive uses this for automatic PII redaction in logs
            "user.email", "user.password", "payment.card_number",
            "address.street_line1", "customer.phone_number"
            // These are conceptual paths; actual masking will rely on pii_category on model fields.
        ]

        // Defines structured log events. The AI agent can be instructed by directives to emit these.
        event UserRegistered {
            // Qualified Name: policies.ApplicationMonitoringPolicies.PrimeCartLogging.UserRegistered
            level: "Info"
            message_template: "New user registered: ID '{userId}', Email (Masked): '{maskedEmail}'."
            fields: ["userId", "maskedEmail"] // Fields expected in the structured log
        }
        event OrderPlaced {
            level: "Info"
            message_template: "Order '{orderId}' placed by user '{userId}' for total '{orderTotal}'."
            fields: ["orderId", "userId", "orderTotal", "itemCount"]
        }
        event CriticalPaymentGatewayError {
            level: "Error"
            message_template: "Critical error communicating with payment gateway. Gateway: '{gatewayName}', Error: '{gatewayError}', Trace: '{paymentTraceId}'."
            fields: ["gatewayName", "gatewayError", "paymentTraceId", "orderAttemptId"]
            alert_on_occurrence: true // Custom attribute for alerting integration
        }
    }
}
```

### 6.3. Basic Security Policy (Example)

```definitive_spec
// policies.dspec

policy CoreSecurityPolicies { // Qualified Name: policies.CoreSecurityPolicies
    title: "Core security policies for PrimeCart."

    security WebApplicationSecurity { // Qualified Name: policies.CoreSecurityPolicies.WebApplicationSecurity
        authentication_scheme MainSessionAuth {
            // Qualified Name: policies.CoreSecurityPolicies.WebApplicationSecurity.MainSessionAuth
            type: "JWT-Cookie"
            details: `
                Session managed via secure, HttpOnly, SameSite=Strict cookie containing a JWT.
                JWT signed with ES256, issuer 'primecart.com', audience 'primecart.com/api'.
                Token lifetime: 1 hour, refreshable up to 24 hours.
            `
            // AI Implementation Agent's directive for API generation uses this to set up auth middleware.
        }
        authentication_scheme PublicApi { type: "None"; details: "Publicly accessible endpoint, no authentication required."; }

        authorization_rule CustomerOrderAccess {
            actor_role: "Customer"
            resource_pattern: "/orders/{orderId}" // Applies to APIs matching this path
            permissions: ["READ", "UPDATE"] // Example: ["READ", "UPDATE", "DELETE"]
            conditions: "jwt.sub == order.customerId" // Pseudocode for condition evaluated by auth middleware
            effect: "Allow"
            description: "Customers can only view their own orders."
        }

        data_protection_measure PasswordStorage {
            data_category: "UserCredentials"
            protection_method: "Hashing via `policies.PrimeCartDataSecurityNFRs.SecurePasswordHashing` policy." // Links to NFR
        }

        input_validation_standard GeneralInputValidation {
            description: "All user-supplied input MUST be validated against defined schemas (`model` specs) by the API framework before processing."
            applies_to_apis: ["*"] // Wildcard or list of qualified API names
        }
    }
}
```

### 6.4. NFR Policies (Conceptual)

```definitive_spec
// policies.dspec

policy PrimeCartDataSecurityNFRs { // Qualified Name: policies.PrimeCartDataSecurityNFRs
    title: "Data Security Non-Functional Requirements Policies"
    description: "Defines policies for handling sensitive data. The AI Implementation Agent consults these when processing relevant models/code, guided by directives."

    nfr PiiFieldEncryption {
        // Qualified Name: policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption
        statement: "All data fields identified as PII (e.g., via `pii_category` attribute on model fields) must be encrypted at rest using AES-256 GCM and in transit using TLS 1.3+."
        scope_description: "Applies to any model field with a `pii_category` attribute."
        // Implementation: The AI Implementation Agent applies encryption/decryption logic (defined in a `directive`)
        // during `CREATE_INSTANCE`, `PERSIST`, and `RETRIEVE` operations.
        verification_method: "Code review of PII handling logic generated; Data-at-rest validation; Penetration testing."
    }

    nfr SecurePasswordHashing {
        // Qualified Name: policies.PrimeCartDataSecurityNFRs.SecurePasswordHashing
        statement: "User passwords must be hashed using a strong, adaptive hashing algorithm (e.g., bcrypt with cost factor >= 12, or Argon2id)."
        // Implementation: `CALL Abstract.PasswordHasher.Hash` in `code` specs defers to a directive
        // that specifies the exact library and parameters.
        verification_method: "Review of PasswordHasher's directive and configuration; Sample hash verification."
    }
}

policy PrimeCartPerformanceNFRs { // Qualified Name: policies.PrimeCartPerformanceNFRs
    title: "Performance Non-Functional Requirements Policies"

    nfr ProductReadPathCaching {
        // Qualified Name: policies.PrimeCartPerformanceNFRs.ProductReadPathCaching
        statement: "Frequently read product data must be cached to reduce database load and improve API response times."
        scope_description: "Applies to `code` specs implementing APIs tagged with 'ProductReadHighVolume'."
        // Implementation: The AI Implementation Agent, guided by a `directive`, wraps relevant code logic.
        target_operations_tagged: ["ProductReadHighVolume"] // `api` specs can have `tags`
        metrics: {
            p95_latency_target_ms: 150,
            cache_hit_ratio_target: 0.85
        }
        // Other attributes can be defined for directives to consume
        // default_cache_ttl_seconds: 60
    }
}
```

---

## Chapter 7: Infrastructure & Deployment Specs (`infra.dspec`)

### 7.1. Application Configuration Schema

```definitive_spec
// infra.dspec

infra PrimeCartSetup { // Qualified Name: infra.PrimeCartSetup
    title: "Configuration and deployment specifications for PrimeCart."

    configuration MainAppConfig { // Qualified Name: infra.PrimeCartSetup.MainAppConfig
        description: "Core configuration schema for the PrimeCart application services. The AI agent uses this to understand available config keys when processing `GET_CONFIG` in `detailed_behavior`."

        NODE_ENV: String { default: "development"; constraints: "enum:['development', 'test', 'production']"; description: "Node environment mode."; }
        PORT: Integer { default: 3000; description: "Application listening port."; }

        DATABASE_URL: String {
            required: true;
            description: "Primary PostgreSQL database connection URL.";
            sensitive: true; // Indicates this should be handled as a secret.
        }
        REDIS_URL: String { required: true; sensitive: true; }

        JWT_SECRET_KEY: String { required: true; sensitive: true; }
        JWT_EXPIRATION_MINUTES: Integer { default: 60; }

        LOG_LEVEL: String {
            default: "INFO";
            constraints: "enum:['DEBUG', 'INFO', 'WARN', 'ERROR']";
            // Conceptually links to policies.ApplicationMonitoringPolicies.PrimeCartLogging
        }

        PAYMENT_GATEWAY_API_KEY: String { required: true; sensitive: true; }
        PAYMENT_GATEWAY_ENDPOINT: String { required: true; format: "uri"; }

        EMAIL_SERVICE_PROVIDER: String { default: "SES"; constraints:"enum:['SES', 'SendGrid']"; description: "Email service to use."; }
        EMAIL_FROM_ADDRESS: String { required: true; format: "email"; }

        // Example config for NFR.SecurePasswordHashing bcrypt cost factor
        SecurityConfig.BcryptCostFactor: Integer { default: 12; description: "Cost factor for bcrypt password hashing."}
    }
}
```

### 7.2. Production Deployment Plan (Conceptual)

```definitive_spec
// infra.dspec

infra PrimeCartSetup {

    deployment ProductionK8sDeployment { // Qualified Name: infra.PrimeCartSetup.ProductionK8sDeployment
        environment_name: "Production"
        target_platform: "Kubernetes"
        description: "Deployment plan for PrimeCart services on Production Kubernetes cluster."

        service UserServiceDeployment {
            image_repository: "primecart/user-service"
            image_tag_source: "git_commit_sha"
            replicas_min: 3 // auto_scale_cpu_target: 70 %
            replicas_max: 8
            cpu_request: "500m"
            memory_request: "1Gi"
            configuration_used: [infra.PrimeCartSetup.MainAppConfig] // Links to the configuration schema
            health_check: { path: "/healthz"; port: 3000; initial_delay_seconds: 30; period_seconds: 10; }
        }

        service ProductServiceDeployment { /* ... similar details ... */ }
        service OrderServiceDeployment { /* ... similar details ... */ }

        global_dependencies: ["RDS_PostgreSQL_Instance", "Elasticache_Redis_Cluster", "AWS_SES_Configuration"]
        ingress_controller: "nginx"
        dns_records: ["primecart.com -> ALB_Endpoint", "api.primecart.com -> ALB_Endpoint"]

        monitoring_setup: `
            - Prometheus for metrics collection.
            - Grafana for dashboards (linked to Prometheus).
            - CloudWatch Logs for application log aggregation (see policies.ApplicationMonitoringPolicies.PrimeCartLogging).
            - PagerDuty integration for critical alerts from policies.ApplicationMonitoringPolicies.PrimeCartLogging event definitions.
        `
        backup_strategy: "Daily RDS snapshots, retained for 30 days. Point-in-time recovery enabled."
        rollback_procedure: `
            1. Identify problematic deployment version via \`kubectl get deployments\`.
            2. Execute \`kubectl rollout undo deployment/<service-name>\` to revert to previous revision.
            3. Monitor service health, logs, and key business metrics via Grafana and CloudWatch.
            4. If rollback fails, escalate to L2 support and initiate IRP-001.
        `
    }
}
```

---

## Chapter 8: Tool Directives (`directives.dspec`) (Illustrating DDM Stage 2/4)

These `directive` artifacts are a crucial output of DDM Stage 2. They guide the **AI Implementation Agent**, bridging abstract specification to concrete implementation (DDM Principle 6: AI as an Automated Implementation Agent).

```definitive_spec
// directives.dspec
// Human Review Focus: Correctness of these directives is CRUCIAL for generating good code.
// These are the "implementation strategy" for the LLM Implementation Agent.

directive PrimeCart_TypeScript_ImplementationDirectives {
    // Qualified Name: directives.PrimeCart_TypeScript_ImplementationDirectives
    target_tool: "PrimeCart_TS_Express_TypeORM_Agent_v1.2"
    description: "Directives guiding the LLM Implementation Agent for the PrimeCart TypeScript, Express, and TypeORM stack."

    // --- API and Model Generation ---
    api_generation: {
        // Instructs AI agent on standard Express handler structure & boilerplate
        default_api_handler_structure: {
            framework: "Express",
            // Agent automatically applies these based on linked policies and models:
            request_validation_middleware: "auto_from_request_model", // e.g., using class-validator
            response_serialization: "auto_from_response_model", // Handles discriminated unions like AuthResult
            error_handling_middleware: "global_handler_linked_to_policies.GlobalAPIPolicies.PrimeCartErrorCatalog",
            authentication_middleware: "auto_from_api_security_scheme"
        }
    }

    // --- Core Logic & Data Patterns (for `detailed_behavior` keywords) ---
    data_operation_patterns: {
        // For 'PERSIST entity TO Abstract.UserDataStore'
        PERSIST: {
            // Agent uses the entity type (e.g., UserEntity) to find its TypeORM repository.
            template: "await this.{{entity_type | toRepositoryName}}.save({{entityVariable}});",
        }
        // SVS Rule: Templates should be valid for the target_tool's capabilities.
    }

    abstract_call_implementations: {
        // For 'CALL Abstract.UserDataStore.CheckByEmail'
        "Abstract.UserDataStore.CheckByEmail": {
            call_template: "await this.userRepository.findOneBy({ email: {{email}} });",
        },
        // For 'CALL Abstract.PasswordHasher.Hash'
        "Abstract.PasswordHasher.Hash": {
            library_import: "import { hash } from 'bcrypt';",
            // The cost factor (12) is sourced from infra.PrimeCartSetup.MainAppConfig.SecurityConfig.BcryptCostFactor
            call_template: "await hash({{password}}, this.config.bcryptCostFactor);",
        },
        // For `EMIT_EVENT ... VIA Abstract.EventPublisher`
        "Abstract.EventPublisher": {
            library_import: "import { eventBus } from 'app-services/event-bus';",
            // Agent derives event name string from the event spec's qualified name.
            call_template: "eventBus.emit('{{event_spec_qualified_name | to_event_string}}', {{payload}});",
        },
        "Abstract.SystemDateTimeProvider.CurrentUTCDateTime": {
            call_template: "new Date();" // Or a more robust UTC date library like 'date-fns-tz'
        }
    }

    // --- NFR Implementation Patterns ---
    nfr_implementation_patterns: {
        // Corresponds to NFR policy `policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption`
        PII_FIELD_ENCRYPTION: { // Triggered if a model field has `pii_category` and NFR policy is active
            library_import: "import { piiEncrypt } from 'common-utils/security/encryption';",
            // Applied by Agent when creating model instances or before PERSIST
            encrypt_template: "piiEncrypt({{fieldValueToEncrypt}})",
        },
        // Corresponds to NFR policy `policies.PrimeCartPerformanceNFRs.ProductReadPathCaching`
        READ_THROUGH_CACHE_WRAPPER: { // Applied if code spec has `tags: ["ProductReadHighVolume"]`
            // Assumes 'this.cacheService' is injected.
            cache_service_property: "this.cacheService",
            wrapper_template: `
                const cacheKey = \`primecart:{{qualified_code_spec_name}}:{{function_args_hash}}\`; // Agent generates key
                const ttl = 60; // Sourced from NFR policy if available
                let cachedData = await {{cache_service_property}}.get(cacheKey);
                if (cachedData) { return cachedData; }
                const freshData = await {{original_function_call_placeholder}}; // Agent replaces this
                await {{cache_service_property}}.set(cacheKey, freshData, { ttl });
                return freshData;
            `
        }
    }
}
```

---

## Chapter 9: Test Specifications (`tests.dspec`) (Illustrating DDM Stage 2/3)

Test specifications are crucial for **Verifiability** (DDM Principle) and are drafted early in the DDM lifecycle.

```definitive_spec
// tests.dspec
// Human Review Focus: Test coverage of requirements/code, correctness of steps and expected results.

test CheckoutSuccessEndToEnd {
    // Qualified Name: tests.CheckoutSuccessEndToEnd
    title: "E2E Test: Successful Order Checkout with Valid Payment"
    description: `
        Verifies the entire checkout flow from adding an item to the cart
        through successful payment and order confirmation.
    `
    verifies_requirement: [requirements.CompleteCheckout] // Assuming a requirements.dspec
    verifies_behavior: [checkout.CheckoutProcess.MainFSM] // Links to the FSM's qualified name
    type: "E2E"
    priority: "Critical"

    test_location: {
        language: "TypeScript",
        framework: "Playwright", // Example E2E testing framework
        filepath: "primecart-app/tests/e2e/checkout.spec.ts",
        // Maps to a test case name within the file for test runners.
        test_case_id_in_file: "Checkout End-to-End - Successful Payment"
    }

    preconditions: [
        "A registered user 'e2e_user@primecart.com' exists with a valid saved payment method.",
        "Product 'PROD123' is in stock with quantity > 1.",
        "The application and all dependent services (payment gateway, inventory) are operational."
    ]
    steps: [
        "Given I am logged in as 'e2e_user@primecart.com'",
        "And my cart is empty",
        "When I add product 'PROD123' to my cart",
        "And I proceed to checkout",
        "And I confirm my default shipping address",
        "And I select my saved payment method",
        "And I click 'Place Order & Pay'",
        "Then I should see an order confirmation page with a new Order ID",
        "And my order status for the new order ID should be 'Confirmed' or 'Processing'",
        "And I should receive an order confirmation email"
    ]
    expected_result: `
        * User successfully navigates the FSM (checkout.CheckoutProcess.MainFSM) from CartNotEmpty to OrderConfirmed.
        * An order record is created in DataStore.Orders with correct items, quantities, and pricing.
        * Inventory for 'PROD123' in DataStore.ProductStock is correctly decremented.
        * Payment is successfully processed via the external payment gateway mock/sandbox.
        * User receives visual confirmation and an email notification.
    `
    test_data_setup: "Requires E2E test dataset: user 'e2e_user@primecart.com', product 'PROD123' in stock."
    // SVS Rule: `verifies_requirement` and `verifies_behavior` must link to existing qualified names.
    // SVS Rule: `test_location.filepath` should be a valid path.
}

test UserRegistrationHandler_DuplicateEmail_Integration {
    // Qualified Name: tests.UserRegistrationHandler_DuplicateEmail_Integration
    title: "Integration Test: User Registration Handler - Duplicate Email"
    description: "Verifies `code.users.HandleUserRegistration` correctly returns an error for duplicate emails, using a mock User Data Store."
    verifies_code: [users.HandleUserRegistration] // Links to the code spec's qualified name
    type: "Integration"
    priority: "Critical"

    test_location: {
        language: "TypeScript",
        framework: "Jest",
        filepath: "primecart-app/src/modules/users/handlers/registration_handler.test.ts",
        // Maps to a specific 'it' or 'test' block name within the Jest file.
        test_case_id_in_file: "handleUserRegistrationLogic should return EmailAlreadyInUse error for existing email"
        // PGT Hint: Can generate Jest test skeleton from this spec and the linked users.HandleUserRegistration spec.
    }

    preconditions: [
        "Mock UserDataStore is configured to return an existing user for email 'existing@example.com'.",
        "Mock PasswordHasher and EventPublisher are configured according to their abstract interfaces."
    ]
    steps: [
        "Given the HandleUserRegistrationLogic function with mocked dependencies (UserDataStore, PasswordHasher, EventPublisher)",
        "When HandleUserRegistrationLogic is called with payload: { email: 'existing@example.com', password: 'ValidPassword123!', password_confirm: 'ValidPassword123!' }",
        "Then the function should return a users.UserRegistrationResult with status 'failure'",
        "And the returned result.error_data.error_code should be 'PC_ERR_USER_EMAIL_IN_USE'",
        "And the mock UserDataStore's 'save user' method (representing PERSIST) should NOT have been called."
    ]
    expected_result: "The registration attempt is rejected with a `users.UserRegistrationResult` indicating failure due to duplicate email. No new user is persisted. No event is emitted."
    // SVS Rule: `verifies_code` must link to an existing qualified code spec name. Test steps should align with code spec's behavior, pre/postconditions.
}

test ProductApi_ReadPathPerformance {
    // Qualified Name: tests.ProductApi_ReadPathPerformance
    title: "Performance Test: Product API Read Path Latency"
    description: "Verifies the product read path meets latency targets under load, exercising the caching mechanism defined in the performance NFRs."
    // This is a key link, tying a test directly to a Non-Functional Requirement.
    verifies_nfr: [policies.PrimeCartPerformanceNFRs.ProductReadPathCaching]
    verifies_api: [apis.products.GetProductDetails] // Assuming this API exists
    type: "Performance"
    priority: "High"

    test_location: {
        language: "JavaScript",
        framework: "k6", // A common performance testing framework
        filepath: "primecart-app/tests/performance/product_api.js",
        test_case_id_in_file: "Product API Read Path Performance Test"
    }
    preconditions: [ "Test database is seeded with 10,000 products.", "Caching service (Redis) is operational." ]
    steps: [
        "Given a 1-minute ramp-up to 200 virtual users",
        "When users continuously request random products for 5 minutes",
        "Then the p95 response time should be less than 150ms",
        "And the cache hit ratio should be greater than 0.85"
    ]
    expected_result: "Test passes if the p95 latency and cache hit ratio metrics from `policies.PrimeCartPerformanceNFRs.ProductReadPathCaching` are met."
}
```
*   **Tooling Tip:** The LDE provides syntax highlighting for Gherkin keywords within `steps` and `acceptance_criteria`.
*   **DDM Note:** `test` artifacts are **Specifications as the Single Source of Truth** for what needs to be tested. They drive test implementation and can be used by the PGT to help generate test code skeletons.

---

## Chapter 10: AI Co-Piloting & The DDM Lifecycle for PrimeCart

The Definitive Development Methodology (DDM) leverages AI as a co-pilot, primarily through the **Prompt Generation Toolkit (PGT)**, which uses the context from the **Specification Hub (ISE)**, and an **AI Implementation Agent** which translates DSpec into code, guided by `directive`s.

*   **AI Co-Piloting Examples with PGT for PrimeCart:**
    *   **Drafting Test Cases:**
        *   User selects PGT task: "Draft `test` scenarios for `api users.RegisterUser`."
        *   PGT fetches `api.users.RegisterUser`, its `request_model users.UserRegistrationPayload`, `response_model users.UserRegistrationResult`, and linked `requirement users.UserRegistration` from the ISE.
        *   PGT generates a rich prompt for an LLM: "Given the PrimeCart `api users.RegisterUser` (specifications below), suggest 5 distinct `test` scenarios in DefinitiveSpec `test` artifact format. Cover valid registration, duplicate email, weak password, mismatched passwords, and server error. Reference errors from `policies.GlobalAPIPolicies.PrimeCartErrorCatalog`."
        *   The Specification Author or QA reviews and refines the LLM's output.
    *   **Suggesting `detailed_behavior` for `code` specs:**
        *   User selects PGT task: "Draft `detailed_behavior` for `code.users.HandleUserLogin` implementing `api.users.LoginUser`."
        *   PGT fetches `api.users.LoginUser`, `code.users.HandleUserLogin`'s signature, pre/postconditions, and the `design.users.UserService` document from the ISE.
        *   PGT generates prompt: "For PrimeCart's `code.users.HandleUserLogin` (details below), draft the `detailed_behavior` using DSpec constrained pseudocode (keywords: CALL, RETURN_SUCCESS, RETURN_ERROR). Consider querying `Abstract.UserDataStore`, verifying password via `Abstract.PasswordVerifier`, generating a session token, and handling errors using `policies.GlobalAPIPolicies.PrimeCartErrorCatalog`. Reference relevant patterns from `directives.PrimeCart_TypeScript_ImplementationDirectives`."
    *   **Identifying Missing Error Conditions:**
        *   User selects PGT task: "Analyze `api.orders.PlaceOrder` and its linked `code.orders.HandlePlaceOrder` for potential missing error conditions."
        *   PGT fetches relevant specs and policies to provide context to the LLM.

*   **AI Implementation Agent Process (Conceptual Example for `users.HandleUserRegistration`):**
    1.  **Input:** `code users.HandleUserRegistration` spec, all linked specs (models, policies), and `directive directives.PrimeCart_TypeScript_ImplementationDirectives`.
    2.  **Parsing:** The Agent parses the `code` spec, including its `signature`, `implementation_location`, and the structured `detailed_behavior`.
    3.  **Directive Consultation:** Agent loads the specified `target_tool`'s directives (`directives.PrimeCart_TypeScript_ImplementationDirectives`).
    4.  **Code Generation - Step by Step from `detailed_behavior`:**
        *   Sets up function signature based on `signature` and `implementation_location`.
        *   Applies `default_api_handler_structure` from directives (Express boilerplate, error handling middleware, logging).
        *   Translates `IF payload.password NOT_EQUALS ...` into a TypeScript `if` statement and error response.
        *   Translates `CALL Abstract.UserDataStore.CheckByEmail` into a TypeORM `this.userRepository.findOneBy(...)` call, using the `abstract_call_implementations` from the directive.
        *   Translates `CALL Abstract.PasswordHasher.Hash` using its corresponding directive.
        *   When processing `CREATE_INSTANCE users.UserEntity`, it checks the `model` for `pii_category` attributes. If the `policies.PrimeCartDataSecurityNFRs.PiiFieldEncryption` policy is active, it applies the `PII_FIELD_ENCRYPTION` pattern from `nfr_implementation_patterns`.
        *   Translates `PERSIST ... TO Abstract.UserDataStore` to `this.userRepository.save(...)`.
        *   Translates `EMIT_EVENT ... VIA Abstract.EventPublisher` using its directive.
    5.  **Output:** Generates the TypeScript code into `primecart-app/src/modules/users/handlers/registration_handler.ts`.
    *   **Human Review:** Focuses on the generated code's fidelity to the `detailed_behavior`'s core logic and ensuring NFRs (like PII encryption) were correctly applied by the agent.

*   **DDM Lifecycle Stages Illustrated with PrimeCart (Simplified):** (See Appendix I for full DDM stage details, not included here)
    1.  **Stage 1: Inception & Initial Requirements Capture:**
        *   Product team drafts initial `requirement`s for PrimeCart (e.g., "Wishlist Feature") in `.dspec` files, assisted by PGT. Stored in ISE.
    2.  **Stage 2: Design and Detailed Specification:**
        *   Architects/dev leads define `design` components (e.g., `designs.WishlistService`), `model`s (`models.WishlistItem`), `api`s (`apis.GetWishlist`), `code` spec skeletons (with structured `detailed_behavior`), `interaction`s, `policy`s (including NFRs), `infra` specs, and initial `test` spec outlines. PGT assists heavily.
        *   **Crucially, `directive` specifications are drafted or refined here to define the precise implementation strategy for the AI Implementation Agent.** `Directive`s for the target stack are also drafted or refined. All linked and stored in ISE.
    3.  **Stage 3: Specification Refinement and Validation:**
        *   **Specification Validation Suite (SVS)** runs automated checks (syntax, qualified name resolution, link integrity, `directive` validity).
        *   SVS (with PGT) can orchestrate AI-driven reviews for semantic consistency (e.g., "Is `code.orders.HandlePlaceOrder.detailed_behavior` consistent with `api.orders.PlaceOrder.request_model` and `behavior.checkout.CheckoutProcess.MainFSM` transitions?").
        *   Human reviews focus on intent and logical correctness. Feedback leads to updates in specs (looping back to Stage 1 or 2 if needed).
    4.  **Stage 4: Automated Generation and Verification Pipeline:**
        *   The **AI Implementation Agent** (guided by `directive`s) generates TypeScript code from `code` specs, integrating NFR logic from policies.
        *   Developers review generated code, implement any `escape_hatch` parts, and integrate.
        *   Automated tests (with skeletons potentially generated from `test` specs) run. Formal verification tools check `formal_model`s.
    5.  **Stage 5: Analysis and Debugging Failures:**
        *   Failures trace back to specs via ISE links.
        *   **IDE Agent** helps compare generated/written code against its source `code` spec.
        *   **Example:** If the AI Agent, guided by a `directive`, generates an inefficient database query for `code products.GetProductByFilter`, the developer doesn't just fix the code. They first analyze if the `detailed_behavior` was ambiguous or if the `directive`'s `data_operation_patterns.RETRIEVE_MULTIPLE` was flawed. They would update the `directive` with a more optimized template, commit the spec change, and then trigger regeneration, ensuring the fix is captured in the "single source of truth."
        *   **Crucially (DDM Principle 8):** If a fix requires deviation from the current spec, the developer **updates the relevant specification(s) in the ISE first**. Then, code is regenerated or manually adjusted to align with the *updated* spec.
        *   PGT assists in debugging by providing context from specs: "Test `tests.InventoryDecrementOnOrder` failed. Here's the test spec, the relevant `code.orders.CommitStockReduction` spec, and the `formal_model.products.InventoryManagement.InventoryAtomicityAndConsistency` summary. Suggest inconsistencies."

---

This guide has demonstrated how DefinitiveSpec can be applied to specify a complex application like PrimeCart. It highlights the interconnectivity of specifications, the role of (conceptual) tooling like the DefinitiveSpec Tools for VS Code, and how different specification artifacts come together. When used within the Definitive Development Methodology (DDM), these specifications become the **single source of truth**, driving development, enabling powerful AI co-piloting and implementation, and leading to higher quality, more verifiable software.

The effective use of the DDM toolset (ISE, PGT, SVS, IDE Agent, AI Implementation Agent) and well-crafted `directive`s are paramount. While this guide primarily focuses on writing `.dspec` artifacts, understanding how these tools interact with the specifications is key to unlocking the full potential of the DDM.

The appendices would provide further details on the DefinitiveSpec language grammar, DDM principles, and other reference materials.