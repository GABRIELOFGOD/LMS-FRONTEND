// import { User, UserRole } from "@/types/user";
// import { useRouter } from "next/navigation";

// export const redirectUser = (user: User) => {
//   const router = useRouter();
//   if (user.role === UserRole.ADMIN) {
//     router.push("/admin");
//   } else if (user.role === UserRole.TEACHER) {
//     router.push("/teacher");
//   } else if (user.role === UserRole.STUDENT) {
//     router.push("/learner");
//   }
// }

/**
 * Safely extracts numeric values from API responses that might return objects instead of primitives
 * Handles common patterns in API responses where numbers are wrapped in objects
 */
export const extractNumericValue = (value: unknown): number => {
  // If it's already a number, return it
  if (typeof value === 'number') return value;
  
  // If it's a string that can be parsed as a number
  if (typeof value === 'string') return parseInt(value) || 0;
  
  // If it's null or undefined
  if (value == null) return 0;
  
  // If it's an object, try common property names
  if (value && typeof value === 'object') {
    // Try common property patterns
    const possibleProps = ['value', 'count', 'total', 'amount', 'number', 'data', 'result'];
    const objValue = value as Record<string, unknown>;
    
    for (const prop of possibleProps) {
      if (objValue[prop] !== undefined) {
        return extractNumericValue(objValue[prop]); // Recursive call for nested objects
      }
    }
    
    // If the object has a toString that returns a number
    const stringValue = String(value);
    if (stringValue !== '[object Object]') {
      const parsed = parseInt(stringValue);
      if (!isNaN(parsed)) return parsed;
    }
  }
  
  // Default fallback
  return 0;
};

/**
 * Safely extracts string values from API responses
 */
export const extractStringValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value == null) return '';
  
  if (value && typeof value === 'object') {
    const possibleProps = ['message', 'text', 'description', 'title', 'name', 'value'];
    const objValue = value as Record<string, unknown>;
    
    for (const prop of possibleProps) {
      if (objValue[prop] !== undefined) {
        return extractStringValue(objValue[prop]);
      }
    }
  }
  
  return String(value);
};