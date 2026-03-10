export type UIEngineLifecycleEvent =
    | {
          type: "component:created";
          name: string;
      }
    | {
          type: "protocol:created";
          name: string;
      }
    | {
          type: "protocol:writer-registered";
          name: string;
          writer: string;
      }
    | {
          type: "protocol:reader-registered";
          name: string;
          reader: string;
      }
    | {
          type: "event-bus:reader-registered";
          owner: string;
          event: string;
      }
    | {
          type: "event-bus:reader-removed";
          owner: string;
          event: string;
      }
    | {
          type: "event-bus:writer-emitted";
          owner: string;
          event: string;
      }
    | {
          type: "service:created";
          label: string;
          name: string;
      }
    | {
          type: "plugin:applied";
          label: string;
          name: string;
      }
    | {
          type: "plugin:disposed";
          label: string;
          name: string;
      };

export type UIEngineErrorEvent = {
    label: string;
    stage: "create" | "dispose" | "runtime";
    error: unknown;
    name?: string;
};

export type UIEngineHooks = {
    onLifecycle?: (event: UIEngineLifecycleEvent) => void;
    onError?: (event: UIEngineErrorEvent) => void;
};

