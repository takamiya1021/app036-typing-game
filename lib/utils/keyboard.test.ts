/**
 * キーボードレイアウト定義のテスト（Red）
 */
import {
  keyboardLayout,
  getKeyPosition,
  getKeyInfo,
  getAllKeys,
  KeyInfo,
} from './keyboard';

describe('Keyboard Layout', () => {
  describe('keyboardLayout', () => {
    it('should define all rows', () => {
      expect(keyboardLayout).toHaveProperty('row1');
      expect(keyboardLayout).toHaveProperty('row2');
      expect(keyboardLayout).toHaveProperty('row3');
      expect(keyboardLayout).toHaveProperty('row4');
    });

    it('should have correct number keys in row1', () => {
      expect(keyboardLayout.row1).toContain('1');
      expect(keyboardLayout.row1).toContain('0');
      expect(keyboardLayout.row1.length).toBeGreaterThan(10);
    });

    it('should have QWERTY keys in row2', () => {
      expect(keyboardLayout.row2).toContain('q');
      expect(keyboardLayout.row2).toContain('w');
      expect(keyboardLayout.row2).toContain('e');
      expect(keyboardLayout.row2).toContain('r');
      expect(keyboardLayout.row2).toContain('t');
      expect(keyboardLayout.row2).toContain('y');
    });

    it('should have home row keys in row3', () => {
      expect(keyboardLayout.row3).toContain('a');
      expect(keyboardLayout.row3).toContain('s');
      expect(keyboardLayout.row3).toContain('d');
      expect(keyboardLayout.row3).toContain('f');
      expect(keyboardLayout.row3).toContain('j');
      expect(keyboardLayout.row3).toContain('k');
      expect(keyboardLayout.row3).toContain('l');
    });

    it('should have bottom row keys in row4', () => {
      expect(keyboardLayout.row4).toContain('z');
      expect(keyboardLayout.row4).toContain('x');
      expect(keyboardLayout.row4).toContain('c');
      expect(keyboardLayout.row4).toContain('v');
      expect(keyboardLayout.row4).toContain('b');
      expect(keyboardLayout.row4).toContain('n');
      expect(keyboardLayout.row4).toContain('m');
    });
  });

  describe('getKeyPosition', () => {
    it('should return position for number keys', () => {
      const pos = getKeyPosition('1');
      expect(pos).toEqual({ row: 1, col: expect.any(Number) });
    });

    it('should return position for home row keys', () => {
      const posF = getKeyPosition('f');
      expect(posF).toEqual({ row: 3, col: expect.any(Number) });

      const posJ = getKeyPosition('j');
      expect(posJ).toEqual({ row: 3, col: expect.any(Number) });
    });

    it('should return null for non-existent keys', () => {
      expect(getKeyPosition('あ')).toBeNull();
      expect(getKeyPosition('@')).toBeNull();
    });

    it('should be case-insensitive', () => {
      const posA = getKeyPosition('a');
      const posAUpper = getKeyPosition('A');
      expect(posA).toEqual(posAUpper);
    });
  });

  describe('getKeyInfo', () => {
    it('should return finger info for home row keys', () => {
      const infoF = getKeyInfo('f');
      expect(infoF).toEqual({
        key: 'f',
        finger: 'index',
        hand: 'left',
        row: 3,
        col: expect.any(Number),
      });

      const infoJ = getKeyInfo('j');
      expect(infoJ).toEqual({
        key: 'j',
        finger: 'index',
        hand: 'right',
        row: 3,
        col: expect.any(Number),
      });
    });

    it('should return correct finger for all left hand keys', () => {
      // Left pinky
      expect(getKeyInfo('a')?.finger).toBe('pinky');
      expect(getKeyInfo('q')?.finger).toBe('pinky');
      expect(getKeyInfo('z')?.finger).toBe('pinky');

      // Left ring
      expect(getKeyInfo('s')?.finger).toBe('ring');
      expect(getKeyInfo('w')?.finger).toBe('ring');
      expect(getKeyInfo('x')?.finger).toBe('ring');

      // Left middle
      expect(getKeyInfo('d')?.finger).toBe('middle');
      expect(getKeyInfo('e')?.finger).toBe('middle');
      expect(getKeyInfo('c')?.finger).toBe('middle');

      // Left index
      expect(getKeyInfo('f')?.finger).toBe('index');
      expect(getKeyInfo('r')?.finger).toBe('index');
      expect(getKeyInfo('v')?.finger).toBe('index');
    });

    it('should return correct finger for all right hand keys', () => {
      // Right index
      expect(getKeyInfo('j')?.finger).toBe('index');
      expect(getKeyInfo('u')?.finger).toBe('index');
      expect(getKeyInfo('n')?.finger).toBe('index');

      // Right middle
      expect(getKeyInfo('k')?.finger).toBe('middle');
      expect(getKeyInfo('i')?.finger).toBe('middle');
      expect(getKeyInfo('m')?.finger).toBe('middle');

      // Right ring
      expect(getKeyInfo('l')?.finger).toBe('ring');
      expect(getKeyInfo('o')?.finger).toBe('ring');

      // Right pinky
      expect(getKeyInfo('p')?.finger).toBe('pinky');
      expect(getKeyInfo(';')?.finger).toBe('pinky');
    });

    it('should return null for non-existent keys', () => {
      expect(getKeyInfo('あ')).toBeNull();
      expect(getKeyInfo('@')).toBeNull();
    });

    it('should handle space bar', () => {
      const spaceInfo = getKeyInfo(' ');
      expect(spaceInfo).toBeDefined();
      expect(spaceInfo?.finger).toBe('thumb');
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys from all rows', () => {
      const allKeys = getAllKeys();
      expect(allKeys.length).toBeGreaterThan(30);
      expect(allKeys).toContain('a');
      expect(allKeys).toContain('z');
      expect(allKeys).toContain('1');
      expect(allKeys).toContain('0');
    });

    it('should not contain duplicates', () => {
      const allKeys = getAllKeys();
      const uniqueKeys = [...new Set(allKeys)];
      expect(allKeys.length).toBe(uniqueKeys.length);
    });

    it('should return keys in row order', () => {
      const allKeys = getAllKeys();
      const firstKey = allKeys[0];
      const lastKey = allKeys[allKeys.length - 1];

      // First key should be from row1
      expect(keyboardLayout.row1).toContain(firstKey);

      // Last key should be from row4 or space
      expect(
        keyboardLayout.row4.includes(lastKey) || lastKey === ' '
      ).toBeTruthy();
    });
  });
});
