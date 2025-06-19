import React from 'react';
import { DspecSyntaxHighlighter } from './DspecSyntaxHighlighter';

interface ArtifactDetailsProps {
  artifactType: string;
  color: string;
}

export const ArtifactDetails: React.FC<ArtifactDetailsProps> = ({ artifactType, color }) => {
  const getArtifactContent = () => {
    switch (artifactType) {
      case 'requirement':
        return {
          subtitle: 'The "Why"',
          description: 'To capture the business need and acceptance criteria, providing a clear goal and a direct link from intent to implementation.',
          code: `requirement UserRegistration {
    title: "New User Account Registration";
    rationale: "Acquiring new customers is essential...";
}`
        };
      
      case 'model':
        return {
          subtitle: 'The Data',
          description: 'To define the precise shape and rules of your data, from API payloads to database entities, ensuring type-safety and validation across the system.',
          code: `model UserRegistrationPayload {
    email: String { format: "email", required: true };
    password: String { minLength: 10 };
}`
        };
      
      case 'code':
        return {
          subtitle: 'The Logic',
          description: 'To detail the step-by-step business logic in an abstract, readable way. This is the single source of truth for implementation.',
          code: `code HandleUserRegistration {
    implements_api: apis.RegisterUser;
    detailed_behavior: \`
      DECLARE user = CALL GetUserByEmail...
      IF user IS_PRESENT THEN
        RETURN_ERROR EmailAlreadyInUse;
      END_IF
      PERSIST new_user...
    \`;
}`
        };
      
      case 'test':
        return {
          subtitle: 'The Proof',
          description: 'To guarantee correctness by explicitly linking test cases to the requirements, APIs, or code they verify, enabling automated test generation and gap analysis.',
          code: `test UserRegistration_DuplicateEmail {
    verifies_code: [code.HandleUserRegistration];
    expected_result: "System returns a 409 Conflict error.";
}`
        };
      
      case 'design':
        return {
          subtitle: 'The Blueprint',
          description: 'To define the high-level components of your system, their responsibilities, and how they relate to one another, creating a clear architectural overview.',
          code: `design AuthenticationService {
    responsibilities: [
        "Validate user credentials",
        "Issue and verify JWTs"
    ];
    dependencies: [ design.UserDataStore ];
}`
        };
      
      case 'api':
        return {
          subtitle: 'The Contract',
          description: 'To define an unambiguous, technology-agnostic contract for how your system\'s services communicate.',
          code: `api RegisterUser {
    path: "/v1/users/register";
    method: "POST";
    request_model: models.UserRegistrationPayload;
}`
        };
      
      case 'interaction':
        return {
          subtitle: 'Choreographing Components',
          description: 'To model how multiple components (design artifacts) collaborate in a sequence to fulfill a larger use case, like a sequence diagram in code. Perfect for simulating and debugging complex flows.',
          code: `interaction UserLoginFlow {
    components: [ design.ApiGateway, design.AuthService ];
    step LoginRequest {
        component: design.ApiGateway;
        action: "Receives POST /login";
        next_step: ValidateCredentials;
    }
    ...
}`
        };
      
      case 'behavior':
        return {
          subtitle: 'Defining State & Transitions',
          description: 'To model a component\'s lifecycle using a formal state machine (fsm). Essential for objects with complex states, like an Order (e.g., PENDING -> PAID -> SHIPPED).',
          code: `behavior OrderLifecycle {
    fsm OrderFSM {
        initial: PENDING;
        state PENDING { ... }
        state PAID { ... }
        transition { from: PENDING, to: PAID, event: "PaymentSuccess" }
    }
}`
        };
      
      case 'event':
        return {
          subtitle: 'Announcing What Happened',
          description: 'To define significant occurrences in your system. It\'s the foundation of event-driven architectures, decoupling components and enabling reactive workflows.',
          code: `event UserRegistered {
    description: "Fired after a new user successfully registers.";
    payload_model: models.NewUserInfo;
}`
        };
      
      case 'policy':
        return {
          subtitle: 'Enforcing System-Wide Rules',
          description: 'To centralize cross-cutting concerns. Instead of every developer re-inventing error handling, you define it once in a policy for the agent to enforce everywhere.',
          code: `policy GlobalErrorPolicy {
    error_catalog DefaultErrors {
        define ValidationFailed { http_status: 400; ... }
    }
}`
        };
      
      case 'nfr':
        return {
          subtitle: 'Defining Quality',
          description: 'To make Non-Functional Requirements (like performance or security) a formal, verifiable part of your spec.',
          code: `policy StandardPerformanceNFRs {
    nfr HighVolumeReadPath {
        statement: "APIs tagged 'HighVolume' must respond in < 100ms at p95.";
        applies_to: [ api.GetProductCatalog ];
    }
}`
        };
      
      case 'infra':
        return {
          subtitle: 'Specifying the Environment',
          description: 'To connect your application to its runtime world. Define environment variables, feature flags, and deployment settings, keeping configuration separate from logic.',
          code: `infra ProductionEnvironment {
    configuration AppConfig {
        STRIPE_API_KEY: String { sensitive: true };
        ENABLE_NEW_CHECKOUT: Boolean { default: false };
    }
}`
        };
      
      case 'glossary':
        return {
          subtitle: 'The Shared Dictionary',
          description: 'To eliminate ambiguity by creating a single source of truth for business and technical terminology. When a kpi mentions "Monthly Recurring Revenue", its definition is here.',
          code: `glossary BusinessMetrics {
    term "MRR" {
        definition: "Monthly Recurring Revenue is the predictable...";
    }
}`
        };
      
      case 'directive':
        return {
          subtitle: 'The Agent\'s "Cookbook"',
          description: 'This is the most powerful concept. It\'s where you **program the AI agent**, teaching it how to translate abstract keywords from your code specs (like PERSIST) into your specific tech stack\'s code. **You are in full control of the output.**',
          code: `directive PrimeCart_TS_Agent_v3.2 {
    target_tool: "TypeScript/TypeORM";
    // Defines how 'PERSIST' is implemented
    pattern PERSIST(entity, store) -> {
        template: "await this.{{store | to_repo}}.save({{entity}});";
    }
}`
        };
      
      case 'kpi':
        return {
          subtitle: 'The Value',
          description: 'Instead of just saying "improve checkout," you define it with absolute clarity. The agent understands this spec as a core system objective.',
          code: `kpi CheckoutConversionRate {
    title: "Checkout Funnel Conversion Rate";
    description: "The percentage of users who start a checkout and complete an order.";
    // The agent understands this formula and its dependencies.
    metric_formula: "(count(events.OrderCompleted) / count(events.CheckoutStarted)) * 100";
    // A clear, verifiable target for success.
    target: "> 65%";
    // Directly links the business goal to the technical implementation.
    related_specs: [ interaction.CheckoutFlow ];
}`
        };
      
      default:
        return {
          subtitle: 'Unknown Artifact',
          description: 'No description available for this artifact type.',
          code: '// No code example available'
        };
    }
  };

  const content = getArtifactContent();

  return (
    <div className="p-4 bg-gray-900/30 border-t border-gray-700/30">
      <div className="mb-3">
        <h4 className="text-sm font-semibold mb-2" style={{ color }}>
          {content.subtitle}
        </h4>
        <p className="text-md text-gray-300 leading-relaxed mb-3">
          {content.description}
        </p>
      </div>
      
      <div className="bg-gray-950/50 rounded-md p-3 border border-gray-700/30">
        <div className="text-xs text-gray-400 mb-2">dspec</div>
        <DspecSyntaxHighlighter code={content.code} />
      </div>
    </div>
  );
}; 