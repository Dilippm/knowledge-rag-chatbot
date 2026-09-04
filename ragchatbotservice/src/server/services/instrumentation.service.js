import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

const sdk = new NodeSDK({
  spanProcessors: [
    new LangfuseSpanProcessor(),
  ],
});

sdk.start();

console.log('Langfuse OpenTelemetry initialized');