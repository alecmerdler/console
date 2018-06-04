module Example (example, greet) where 

import Prelude ((<>))

greet :: String -> String
-- greet name = "Hello, " <> name <> "!"
greet name = "Hello!"

example :: String
example = greet "World"
