import Importer from "mysql-import";

const importer = new Importer({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
});

importer.onProgress((progress) => {
  const percent =
    Math.floor((progress.bytes_processed / progress.total_bytes) * 10000) / 100;
  console.log(`${percent}% Completed`);
});

export default async () => {
  try {
    const result = await importer.import("../databases/world.sql");
    const files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
  } catch (err) {
    console.error(err);
  }
};
