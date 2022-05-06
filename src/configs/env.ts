import secret from "../../secrets.json";

let env: string;
let node_env = process.env.NODE_ENV;

if (node_env && Object.keys(secret).includes(node_env)) {
  env = node_env;
} else {
  env = "local";
}

let secret_env = secret[env];

export default secret_env;
