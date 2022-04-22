import secret from "../../secrets.json"
let secret_env = secret[process.env.NODE_ENV || "local"]

export default secret_env
