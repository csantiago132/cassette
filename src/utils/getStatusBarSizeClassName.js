function getClassNameForRange (min, max) {
  return 'rrap__audio_info__' + min + (max ? '-' + max : '');
}

function getStatusBarSizeClassName (width) {
  if (width < 166) return null;
  if (width < 246) return getClassNameForRange(166, 245);
  if (width < 346) return getClassNameForRange(246, 345);
  if (width < 446) return getClassNameForRange(346, 445);
  if (width < 516) return getClassNameForRange(446, 515);
  return getClassNameForRange(516);
}

export default getStatusBarSizeClassName;
