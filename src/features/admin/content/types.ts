export type AdminMutationResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };
