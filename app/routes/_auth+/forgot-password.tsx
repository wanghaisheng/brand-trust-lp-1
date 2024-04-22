import { useId } from "react"
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { sendResetPasswordLink } from "@/lib/server/auth-utils.sever"
import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { CommonErrorBoundary } from "@/components/error-boundry"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
})

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  })
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Forgot Password" }]
  }
)

export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrfToken(request)
  const formData = await request.formData()

  const submission = await parse(formData, {
    schema,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json({ ...submission, emailSent: false })
  }

  const user = await prisma.user.findFirst({
    where: {
      email: submission.value.email,
    },
  })

  if (user) {
    await sendResetPasswordLink(user)
    return json({ ...submission, emailSent: true } as const)
  }
}

export default function ForgotPassword() {
  const navigation = useNavigation()
  const isFormSubmitting = navigation.state === "submitting"
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { email }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })

  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Get password reset link
      </h2>
      {!lastSubmission?.emailSent ? (
        <div className="mt-10 w-full sm:mx-auto">
          <Form className="space-y-6" method="post" {...form.props}>
            <AuthenticityTokenInput />
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="michael@scott.com"
                  error={email.error}
                  {...conform.input(email, { type: "email" })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                disabled={isFormSubmitting}
                className="w-full"
                type="submit"
              >
                {isFormSubmitting && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Request Reset Link
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="mx-auto mt-6 max-w-lg">
          <Alert>
            <AlertTitle>Link sent successfully!</AlertTitle>
            <AlertDescription>
              Password reset link has been sent to your email. Please check spam
              folder as well
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
