import type { ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { SIGN_IN_PATH } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

/** Wait for session, then require a signed-in user. Returns to this path after login. */
export function RequireAuth({
  children,
  loading,
}: {
  children: ReactNode;
  loading?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <>
        {loading ?? (
          <div className="flex min-h-[40dvh] items-center justify-center text-sm text-muted">
            Checking account…
          </div>
        )}
      </>
    );
  }
  if (!user) {
    return (
      <Navigate
        to={SIGN_IN_PATH}
        search={{ next: pathname }}
      />
    );
  }
  return <>{children}</>;
}
