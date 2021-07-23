export function normalizeEdition(input: string): string {
  const edition = input.toLowerCase().replace(/[´']/g, "");
  switch (edition) {
    case "dc":
    case "directors cut":
      return "Director's cut";
    case "se":
      return "Special Edition";
    case "ce":
      return "Collector's Edition";
    case "special collectors edition":
      return "Special Collector's Edition";
    case "extended":
    case "extended edition":
      return "Extended Edition";
    case "digitally remastered":
      return "Digitally Remastered";
    default:
      return input;
  }
}
