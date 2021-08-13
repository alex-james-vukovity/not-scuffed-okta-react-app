import { BrowserRouter, Route, useHistory } from "react-router-dom"
import { Security, LoginCallback, useOktaAuth, SecureRoute } from "@okta/okta-react"
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js"

const Home = () => {
  const { oktaAuth } = useOktaAuth()

  const logout = async () => oktaAuth.signOut()

  return (
    <div>
      <h1>Logged in</h1>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

const Okta = ({ children }) => {
  const config = {
    clientId: "0oa1go71zlYEElmQ65d7",
    issuer: "https://dev-28193283.okta.com/oauth2/default",
    redirectUri: "http://localhost:3000/web/login/callback",
    scopes: ["openid", "profile", "email"],
    postLogoutRedirectUri: `${window.location.origin}/web`,
  }

  const oktaAuth = new OktaAuth(config)
  const { replace } = useHistory()
  const restoreOriginalUri = async (_oktaAuth) =>
    replace(toRelativeUrl("/web", window.location.origin))

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      {children}
    </Security>
  )
}

export const App = () => {
  return (
    <BrowserRouter>
      <Okta>
        <Route path="/web/login/callback" component={LoginCallback} />

        <SecureRoute path="/web" exact>
          <Home />
        </SecureRoute>

        <SecureRoute path="/web/secure" exact>
          <h1>This is a secure route</h1>
        </SecureRoute>
      </Okta>
    </BrowserRouter>
  )
}
