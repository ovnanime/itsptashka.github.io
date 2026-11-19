// Растеризует страницы PDF в PNG через PDFKit (только macOS).
// Запуск: swift scripts/pdf-pages.swift <input.pdf> <outDir> <widthPx>
// Вызывается из scripts/book-pages.mjs, руками запускать не нужно.
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count == 4, let width = Double(args[3]) else {
  FileHandle.standardError.write("usage: pdf-pages.swift <input.pdf> <outDir> <widthPx>\n".data(using: .utf8)!)
  exit(2)
}

guard let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("cannot open \(args[1])\n".data(using: .utf8)!)
  exit(1)
}

let outDir = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

for index in 0..<doc.pageCount {
  guard let page = doc.page(at: index) else { continue }
  let box = page.bounds(for: .mediaBox)
  let scale = width / box.width
  let pixelsWide = Int(width.rounded())
  let pixelsHigh = Int((box.height * scale).rounded())

  guard let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: pixelsWide, pixelsHigh: pixelsHigh,
    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
    colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
  ), let context = NSGraphicsContext(bitmapImageRep: rep) else { exit(1) }

  let cg = context.cgContext
  cg.setFillColor(NSColor.white.cgColor)
  cg.fill(CGRect(x: 0, y: 0, width: pixelsWide, height: pixelsHigh))
  cg.interpolationQuality = .high
  cg.scaleBy(x: scale, y: scale)
  cg.translateBy(x: -box.minX, y: -box.minY)
  page.draw(with: .mediaBox, to: cg)

  let name = String(format: "%03d.png", index + 1)
  try rep.representation(using: .png, properties: [:])!.write(to: outDir.appendingPathComponent(name))
}

print(doc.pageCount)
