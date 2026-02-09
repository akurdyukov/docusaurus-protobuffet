# Research: Proto Source Templates

## R1: copyfiles flag for preserving directory structure

- **Decision**: Use `copyfiles -u 2 "src/templates/**/*" dist/templates/` instead of `copyfiles -f src/templates/* dist/templates/`
- **Rationale**: The `-f` flag flattens all files into a single directory, losing the nested `proto/` subdirectory structure. The `-u 2` flag strips the first 2 path segments (`src/templates/`) while preserving everything below, so `src/templates/proto/protobuffet/example/ad/v1/ads.proto` becomes `dist/templates/proto/protobuffet/example/ad/v1/ads.proto`. The glob must also change from `*` to `**/*` to match files in subdirectories.
- **Alternatives considered**: Using a custom Node.js copy script — rejected as unnecessary; `copyfiles` already supports this with the `-u` flag.

## R2: fs.cpSync availability in Node 18

- **Decision**: Use `fs.cpSync(src, dest, { recursive: true })` to copy the proto directory tree in the init flow.
- **Rationale**: `fs.cpSync` was added in Node 16.7.0 and is stable in Node 18+. The project requires Node >=18.0.0, so this API is safe to use. It replaces the single-file `fs.copyFileSync` call for `proto_workspace.json`.
- **Alternatives considered**: Using `shelljs.cp('-R', ...)` (already a dependency) — viable but `fs.cpSync` is standard library and avoids relying on a third-party tool for a simple recursive copy.

## R3: Docker-based protoc-gen-doc command

- **Decision**: Use `docker run --rm -v $(pwd)/proto:/protos -v $(pwd)/fixtures:/out pseudomuto/protoc-gen-doc --doc_opt=json,proto_workspace.json` as the `generate-proto-json` npm script.
- **Rationale**: The `pseudomuto/protoc-gen-doc` Docker image is the standard way to run protoc-gen-doc. It expects protos mounted at `/protos` and outputs to `/out`. The `--doc_opt=json,proto_workspace.json` flag produces JSON format with the expected filename. This matches the existing `proto_workspace.json` format consumed by the plugin.
- **Alternatives considered**: Installing protoc and protoc-gen-doc natively — rejected as it requires platform-specific setup and is harder to reproduce consistently.

## R4: Modifying generated project's package.json programmatically

- **Decision**: Read the generated project's `package.json`, parse it, add the `generate-proto-json` script, and write it back using `JSON.parse`/`JSON.stringify`.
- **Rationale**: The generated project already has a `package.json` from `create-docusaurus`. We need to inject a single script entry. Reading, modifying, and writing JSON is straightforward and doesn't require additional dependencies.
- **Alternatives considered**: Using `npm pkg set` CLI — works but adds a shell execution step. Direct file manipulation is simpler and more explicit.

## R5: Proto file reconstruction from JSON descriptor

- **Decision**: Reconstruct 9 `.proto` files from the `proto_workspace.json` data. Each file includes proper `syntax`, `package`, `import`, `message`, `enum`, `service`, and field definitions with comments matching the JSON `description` fields.
- **Rationale**: The JSON descriptor contains all the information needed to reconstruct the proto files: package names, message/enum/service definitions, field types, labels, and descriptions. The proto files do not need to produce byte-identical JSON output — they just need to be valid proto3 files that produce structurally equivalent documentation.
- **Alternatives considered**: N/A — this is the only viable approach since the original proto files are not available.
