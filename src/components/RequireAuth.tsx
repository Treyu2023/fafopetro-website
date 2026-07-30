import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

/** Wait for session, then require a signed-in user. */
export function RequireAuth({
  children,
  loading,
}: {
  children: ReactNode;
  loading?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
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
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
