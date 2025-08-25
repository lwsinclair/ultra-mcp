# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.1] - 2025-08-25

### Fixed
- **Windows Compatibility Issue** - Resolves [GitHub Issue #14](https://github.com/RealMikeChong/ultra-mcp/issues/14)
  - Fixed hardcoded `/tmp` paths causing `ENOENT: no such file or directory` errors on Windows
  - Added cross-platform temp directory utilities using `os.tmpdir()`
  - Fixed build script to use cross-platform shell commands (`shx`)
  - Ultra MCP now works seamlessly on Windows, macOS, and Linux
  
### Added
- **Multi-Platform CI Testing**
  - GitHub Actions now tests on Windows, Linux, and macOS
  - Comprehensive test coverage across all supported platforms
  - Cross-platform compatibility verification for future releases

### Technical Details
- New `src/utils/temp-paths.ts` utilities for cross-platform temp file handling
- Updated logging in `src/cli.ts` and `src/start-server.ts` to use system temp directory
- Added `shx` dependency for cross-platform build commands
- Enhanced test suite with Windows-specific compatibility tests

## [0.8.0] - 2025-08-21

### Added
- **Enhanced Gemini Provider with Advanced Tools**
  - Google Search grounding enabled by default for all Gemini models
  - URL context tool automatically enabled for enhanced web content analysis
  - Rich metadata in responses including grounding and URL context information
  - Support for up to 20 URLs per request for comprehensive context

### Changed
- **Optional MCP Prompt Parameters**
  - All MCP prompt parameters are now optional with sensible defaults
  - Improved user experience - prompts can be invoked without any parameters
  - Added helpful guidance messages when parameters are omitted
  - Enhanced prompt usability across all tools (deep-reasoning, analyze-code, etc.)

### Updated
- **AI SDK Dependencies to Latest Versions**
  - @ai-sdk/azure: 2.0.4 → 2.0.19
  - @ai-sdk/google: 2.0.2 → 2.0.8
  - @ai-sdk/openai: 2.0.4 → 2.0.19
  - @ai-sdk/openai-compatible: 1.0.2 → 1.0.11
  - @ai-sdk/xai: 2.0.2 → 2.0.11
  - ai: 5.0.5 → 5.0.21

### Technical Details
- Added URL detection utilities for future conditional logic
- Enhanced response metadata with sources and grounding information
- Maintained backward compatibility with existing configurations
- Tools can be disabled via `useSearchGrounding: false` or `useUrlContext: false`

### Developer Experience
- Simplified prompt invocation - no required parameters for most use cases
- Better error messages and guidance when parameters are missing
- Preserved all existing functionality while adding new capabilities

## [0.7.1] - Previous Release
- Initial release with core MCP functionality
- OpenAI, Gemini, Azure, and Grok provider support
- Vector indexing and semantic search
- Basic AI workflow tools