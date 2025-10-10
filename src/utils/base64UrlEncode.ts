export function base64urlEncode(obj: object) {
    // prettier-ignore
    return Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .split("=").join("")
        .split("+").join("-")
        .split("/").join("_");
}
