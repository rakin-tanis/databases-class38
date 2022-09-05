import Importer from "mysql-import";

const importer = new Importer({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
});

importer.onProgress((progress) => {
  const percent =
    Math.floor((progress.bytes_processed / progress.total_bytes) * 10000) / 100;
  console.log(`${percent}% Completed`);
});

export default async () => {
  try {
    const result = await importer.import("../../../Week1/world.sql");
    const files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};