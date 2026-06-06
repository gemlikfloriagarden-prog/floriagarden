import mysql from "mysql2/promise";

/**
 * cPanel MySQL bağlantısı (Vercel → uzaktan).
 * Kimlik bilgileri ortam değişkenlerinden gelir — koda yazılmaz.
 * Vercel → Settings → Environment Variables:
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *
 * Serverless dostu: tek havuz global'de tutulur, bağlantı limiti düşük
 * (paylaşımlı hosting limitlerini aşmamak için).
 */

declare global {
  // eslint-disable-next-line no-var
  var __floriaPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (!global.__floriaPool) {
    global.__floriaPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 3),
      charset: "utf8mb4",
      // Alastyr uzak bağlantısında gerekebilir; sorun olursa kaldırırız.
      enableKeepAlive: true,
    });
  }
  return global.__floriaPool;
}

/** SQL parametreleri için izin verilen tipler. */
export type SqlParam = string | number | boolean | null | Date;

/** SELECT vb. — satır dizisi döner. */
export async function query<T = unknown>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T[];
}

/** INSERT/UPDATE/DELETE — sonuç başlığı döner. */
export async function execute(
  sql: string,
  params: SqlParam[] = [],
): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params);
  return result as mysql.ResultSetHeader;
}
