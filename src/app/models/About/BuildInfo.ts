export class BuildInfo {
  buildNumber: string;
}
export class SupportedRuntimesResponse
{
  supportedRuntimes: SupportedRuntime[];
}
export class SupportedRuntime
{
  webKey: string;
  title: string;
  acceptFileName: string;
  markdownDescription: string;
}