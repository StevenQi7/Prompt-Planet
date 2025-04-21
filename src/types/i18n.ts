/**
 * 国际化相关类型定义
 */
import locales from '@/locales';

// 支持嵌套的翻译键类型
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// 扩展字符串类型，允许所有使用中的翻译键
export type TranslationKey = NestedKeyOf<typeof locales.zh> | string;

/**
 * 通用翻译函数类型
 * 定义为更宽松的类型，以便兼容不同的使用场景
 */
export type TFunction = {
  (key: TranslationKey, params?: Record<string, any>): string;
  (key: string, params?: Record<string, any>): string;
}; 