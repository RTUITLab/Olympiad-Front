export class BuildInfo {
  buildNumber: string;
}
export class SupportedRuntimesResponse
{
  supportedRuntimes: SupportedRuntime[];
}
export class SupportedRuntime
{
  title: string;
  markdownDescription: string;
}