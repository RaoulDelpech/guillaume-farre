import fs from "fs/promises";
import path from "path";

/**
 * ContentManager - Gestionnaire de contenu
 *
 * Architecture préparée pour migration future vers base de données.
 * Actuellement utilise les fichiers JSON (messages/fr.json, etc.)
 *
 * Pour migrer vers DB plus tard :
 * 1. Créer une table `content` avec (locale, key, value, updated_at)
 * 2. Implémenter ContentManagerDB qui implémente ContentManagerInterface
 * 3. Switcher l'export par défaut
 *
 * @author Lalou
 * @date 2025-11-30
 */

export interface ContentManagerInterface {
  get(locale: string, key: string): Promise<string | null>;
  set(locale: string, key: string, value: string): Promise<boolean>;
  setMany(locale: string, changes: Record<string, string>): Promise<boolean>;
  getAll(locale: string): Promise<Record<string, any>>;
}

/**
 * Implémentation fichier JSON
 */
class ContentManagerJSON implements ContentManagerInterface {
  private getFilePath(locale: string): string {
    return path.join(process.cwd(), "messages", `${locale}.json`);
  }

  async getAll(locale: string): Promise<Record<string, any>> {
    try {
      const filePath = this.getFilePath(locale);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  async get(locale: string, key: string): Promise<string | null> {
    const all = await this.getAll(locale);
    return this.getNestedValue(all, key);
  }

  async set(locale: string, key: string, value: string): Promise<boolean> {
    return this.setMany(locale, { [key]: value });
  }

  async setMany(locale: string, changes: Record<string, string>): Promise<boolean> {
    try {
      const filePath = this.getFilePath(locale);
      const content = await this.getAll(locale);

      // Appliquer les changements
      for (const [key, value] of Object.entries(changes)) {
        this.setNestedValue(content, key, value);
      }

      // Sauvegarder avec backup
      const backupPath = `${filePath}.backup-${Date.now()}`;
      const currentContent = await fs.readFile(filePath, "utf-8").catch(() => "{}");
      await fs.writeFile(backupPath, currentContent);

      // Écrire le nouveau contenu
      await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");

      return true;
    } catch (error) {
      console.error("ContentManager.setMany error:", error);
      return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): string | null {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined) return null;
      current = current[key];
    }

    return typeof current === "string" ? current : null;
  }

  private setNestedValue(obj: Record<string, any>, path: string, value: string): void {
    const keys = path.split(".");
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }
}

// Export singleton
// Pour migrer vers DB : remplacer par new ContentManagerDB()
export const contentManager: ContentManagerInterface = new ContentManagerJSON();

export default contentManager;
