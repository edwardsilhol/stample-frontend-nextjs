import { Node as ProseMirrorNode } from 'prosemirror-model';

function getAllNodesByType(
  doc: ProseMirrorNode,
  nodeType: string,
): Array<ProseMirrorNode> {
  const set = new Set<ProseMirrorNode>();

  doc.descendants((node) => {
    if (node.type.name === nodeType) {
      set.add(node);
    }
  });

  return Array.from(set);
}

function getMentionNodes(doc: ProseMirrorNode): Array<ProseMirrorNode> {
  return getAllNodesByType(doc, 'mention');
}

export { getAllNodesByType, getMentionNodes };
