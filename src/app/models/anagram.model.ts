export interface AnagramRequest {
  letters: string;
}

export interface AnagramResponse {
  originalLetters: string;
  anagrams: string[];
  totalAnagrams: number;
  fromCache: boolean;
  processingTimeMs: number;
}
