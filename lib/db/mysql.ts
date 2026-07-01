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
      // Admin verisi 9 sorguyu paralel çeker; havuzu büyütünce tek turda biter.
      // Alastyr "too many connections" derse Vercel'de DB_CONNECTION_LIMIT düşür.
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 8),
      charset: "utf8mb4",
      // DATE/DATETIME'ı string döndür (timezone kaymalarını önler)
      dateStrings: true,
      // Alastyr uzak bağlantısında gerekebilir; sorun olursa kaldırırız.
      enableKeepAlive: true,
      // Uzak (Alastyr) sunucu yavaş/erişilemezse 10 sn takılmak yerine hızlı
      // başarısız ol → sayfa fallback'e düşer, ziyaretçi beklemede kalmaz.
      connectTimeout: 8000,
      // Serverless'te boşta kalan bağlantıları geri dönüştür (kopuk bağlantı
      // üzerinden sorgu çalıştırıp takılmayı önler).
      idleTimeout: 60000,
      maxIdle: Number(process.env.DB_CONNECTION_LIMIT ?? 8),
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
