/**
 * Handles parsing of request bodies based on content type.
 */
export default class BodyParser {
  /**
   * Internal cache for the request bodies.
   */
  private cache = new WeakMap<Request, unknown>();

  /**
   * Parse and cache the request body based on content type.
   *
   * @param request The HTTP request.
   *
   * @returns The parsed body.
   */
  public async parse(request: Request): Promise<unknown> {
    const cached = this.cache.get(request);

    if (cached !== undefined) {
      return cached;
    }

    const contentType = request.headers.get("content-type") || "";

    let body: unknown;

    try {
      body = await this.parseByContentType(request, contentType);
    } catch (e) {
      if (e instanceof SyntaxError) {
        body = {};
      }

      if (!(e instanceof SyntaxError)) {
        throw e;
      }

      body = {};
    }

    this.cache.set(request, body);

    return body;
  }

  /**
   * Parse request body based on content type.
   *
   * @param request The request to parse by content-type.
   *
   * @return The parsed body from the request.
   */
  private async parseByContentType(
    request: Request,
    contentType: string,
  ): Promise<unknown> {
    if (contentType.includes("application/json")) {
      return await this.parseJson(request);
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
      return await this.parseFormUrlEncoded(request);
    }

    if (contentType.includes("multipart/form-data")) {
      return await this.parseMultipart(request);
    }

    return {};
  }

  /**
   * Parse JSON request body.
   *
   * @param request The request to parse.
   *
   * @returns The object parsed from the request.
   */
  private async parseJson(request: Request): Promise<unknown> {
    return await request.json();
  }

  /**
   * Parse URL-encoded form data.
   *
   * @param request The request to parse.
   *
   * @returns The object parsed from the request.
   */
  private async parseFormUrlEncoded(request: Request): Promise<unknown> {
    const formData = await request.formData();
    return this.formDataToObject(formData);
  }

  /**
   * Parse multipart form data.
   *
   * @param request The request to parse.
   *
   * @returns The object parsed from the request.
   */
  private async parseMultipart(request: Request): Promise<unknown> {
    const formData = await request.formData();
    return this.formDataToObject(formData);
  }

  /**
   * Convert form data to a plain object.
   *
   * @param formData The form data to transform.
   *
   * @returns The plain object transformed from the form data.
   */
  private formDataToObject(formData: FormData): Record<string, unknown> {
    const obj: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        this.addToObject(obj, key, value);
        continue;
      }

      this.addToObject(obj, key, value);
    }

    return obj;
  }

  /**
   * Add a value to an object, converting to array if key already exists.
   */
  private addToObject(
    obj: Record<string, unknown>,
    key: string,
    value: string | File,
  ): void {
    if (!(key in obj)) {
      obj[key] = value;

      return;
    }

    if (Array.isArray(obj[key])) {
      (obj[key] as (string | File)[]).push(value);

      return;
    }

    obj[key] = [obj[key] as string | File, value];
  }
}
