import type { NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";

/*
The following errors are passed as error query parameters to the default or overridden sign-in page:

    OAuthSignin: Error in constructing an authorization URL (1, 2, 3),
    OAuthCallback: Error in handling the response (1, 2, 3) from an OAuth provider.
    OAuthCreateAccount: Could not create OAuth provider user in the database.
    EmailCreateAccount: Could not create email provider user in the database.
    Callback: Error in the OAuth callback handler route
    OAuthAccountNotLinked: If the email on the account is already linked, but not with this OAuth account
    EmailSignin: Sending the e-mail with the verification token failed
    CredentialsSignin: The authorize callback returned null in the Credentials provider. We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
    SessionRequired: The content of this page requires you to be signed in at all times. See useSession for configuration.
    Default: Catch all, will apply, if none of the above matched

Example: /auth/signin?error=Default

*/

type Props = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
};

const Page: NextPage<Props> = ({ providers }: Props) => {
  const router = useRouter();
  const error = router.query.error;

  //console.log(error);
  //error=OAuthAccountNotLinked

  if (!providers) return null;

  return (
    <>
      <Head
        title="Signin | Botgame"
        description="Sign in to Botgame"
        domainUrl="https://botgame.andyfx.net"
        url="https://botgame.andyfx.net/sign-in"
      />
      <main className="flex items-center justify-center h-screen p-4 bg-neutral-50 dark:bg-neutral-800">
        <div>
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">Sign in</h1>
          <p className="mb-8 text-center">to Botgame</p>

          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id)}
                className="
              flex bg-white items-center w-64
              justify-around p-3 text-black shadow-md m-2 
               font-medium 
               hover:bg-neutral-100 
               transition duration-100 ease-out hover:ease-in
               focus:bg-neutral-200
              "
              >
                <Icon name={provider.name} className="h-7 mr-2" />
                <span>Sign in with {provider.name}</span>
              </button>
            </div>
          ))}

          <p className="text-sm text-center w-64 mt-3">
            By signing in, you agree to our{" "}
            <Link className="underline" href="/info/terms-of-service">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/info/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
          {error && <p className="text-red-600">something went wrong</p>}
          {error && <p className="text-red-600">error: {JSON.stringify(error)}</p>}
        </div>
      </main>
    </>
  );
};

export default Page;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

function Icon(props: { name: string; className?: string }) {
  if (props.name === "GitHub") {
    return (
      <svg width="32" height="32" aria-hidden="true" viewBox="0 0 16 16" className={props.className}>
        <path
          fillRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    );
  } else if (props.name === "Discord") {
    return (
      <svg width="38" height="32" viewBox="0 0 71 55" fill="none" className={props.className}>
        <g clipPath="url(#clip0)">
          <path
            d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
            fill="#5865F2"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="71" height="55" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  } else if (props.name === "Google") {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" className={props.className}>
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
          <path
            fill="#4285F4"
            d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
          />
          <path
            fill="#34A853"
            d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
          />
          <path
            fill="#FBBC05"
            d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
          />
          <path
            fill="#EA4335"
            d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
          />
        </g>
      </svg>
    );
  } else {
    return <div>hm</div>;
  }
}
