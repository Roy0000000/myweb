import Foundation
import PDFKit
import AppKit

struct Job {
  let pdfPath: String
  let outputDirectory: String
}

let jobs = [
  Job(
    pdfPath: "/Users/Zhuanz/Desktop/Code/myweb/downloads/weijifen-notes.pdf",
    outputDirectory: "/Users/Zhuanz/Desktop/Code/myweb/assets/note-previews/calculus"
  ),
  Job(
    pdfPath: "/Users/Zhuanz/Desktop/Code/myweb/downloads/xiandai-notes.pdf",
    outputDirectory: "/Users/Zhuanz/Desktop/Code/myweb/assets/note-previews/linear-algebra"
  )
]

let fileManager = FileManager.default

func renderPreviewPages(for job: Job) throws {
  let pdfURL = URL(fileURLWithPath: job.pdfPath)
  let outputURL = URL(fileURLWithPath: job.outputDirectory, isDirectory: true)

  guard let document = PDFDocument(url: pdfURL) else {
    throw NSError(domain: "render_note_previews", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to open \(job.pdfPath)"])
  }

  try fileManager.createDirectory(at: outputURL, withIntermediateDirectories: true)

  let pageCount = min(16, document.pageCount)
  for index in 0..<pageCount {
    guard let page = document.page(at: index) else {
      continue
    }

    let bounds = page.bounds(for: .mediaBox)
    let scale: CGFloat = 1.45
    let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)

    let image = NSImage(size: size)
    image.lockFocus()
    NSColor.white.setFill()
    NSBezierPath(rect: NSRect(origin: .zero, size: size)).fill()

    guard let context = NSGraphicsContext.current?.cgContext else {
      image.unlockFocus()
      continue
    }

    context.scaleBy(x: scale, y: scale)
    page.draw(with: .mediaBox, to: context)
    image.unlockFocus()

    guard
      let tiffData = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiffData),
      let pngData = bitmap.representation(using: .png, properties: [:])
    else {
      continue
    }

    let fileName = String(format: "page-%02d.png", index + 1)
    let targetURL = outputURL.appendingPathComponent(fileName)
    try pngData.write(to: targetURL)
    print("wrote \(targetURL.path)")
  }
}

do {
  for job in jobs {
    try renderPreviewPages(for: job)
  }
} catch {
  fputs("render failed: \(error)\n", stderr)
  exit(1)
}
