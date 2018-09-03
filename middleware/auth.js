import { Bearer } from 'permit'

const permit = new Bearer({
  basic: 'username', // Also allow a Basic Auth username as a token.
  query: 'access_token' // Also allow an `?access_token=` query parameter.
})

const apiKeys = {
  tokentax: '7c96053e681f16e90aaefd33566ed1fc',
  coinfox: 'd41d8cd98f00b204e9800998ecf8427e'
}

const authenticate = (req, res, next) => {
  // Try to find the bearer token in the request.
  const token = permit.check(req)

  // No token found, so ask for authentication.
  if (!token) {
    permit.fail(res)
    return next(new Error(`Authentication required!`))
  }

  const keys = Object.values(apiKeys)

  if (keys.indexOf(token) > -1) {
    return next()
  }

  permit.fail(res)
  next(new Error(`Authentication invalid!`))
}

export default authenticate
