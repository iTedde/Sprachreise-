from rubymarshal.reader import load
from rubymarshal.classes import RubyObject, UserDef, Symbol
G=r"X:\Sprachreise\Pokemon Essentials v21.1 2023-07-30 (1)\Pokemon Essentials v21.1 2023-07-30"
def L(n): return load(open(G+"/Data/"+n,'rb'))
def s(x): return x.decode('utf8','replace') if isinstance(x,bytes) else str(x)

from rubymarshal.writer import Writer as _W
import io as _io
class FixedWriter(_W):
    """Ruby counts Strings/Floats in the object-link table; rubymarshal doesn't."""
    def _bump(self):
        self.objects[('__nolink__', len(self.objects))] = len(self.objects)
    def write_bytes(self, obj):
        self._bump(); super().write_bytes(obj)
    def write_ruby_string(self, obj):
        self._bump()
        # avoid double-count: parent calls write_bytes
        encoding = "utf-8"
        attributes = dict(obj.attributes)
        if "E" in attributes and not attributes["E"]:
            encoding = "latin-1"
        elif "encoding" in attributes:
            encoding = attributes["encoding"].decode()
        else:
            attributes["E"] = True
        encoded = obj.text.encode(encoding)
        from rubymarshal.constants import TYPE_IVAR, TYPE_STRING
        self.fd.write(TYPE_IVAR)
        self.fd.write(TYPE_STRING); self.write_long(len(encoded)); self.fd.write(encoded)
        self.write_attributes(attributes)
    def write_float(self, obj):
        self._bump(); super().write_float(obj)
    def write_string_nolink(self, obj): pass

def dumps(obj):
    fd = _io.BytesIO(); fd.write(b"\x04\x08"); FixedWriter(fd).write(obj); return fd.getvalue()
def save(n, obj):
    open(G+"/Data/"+n, "wb").write(dumps(obj))
