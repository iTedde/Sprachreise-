import sys; sys.path.insert(0,'tools')
from maplib import *
for mid in sys.argv[1:]:
    m = L("Map%03d.rxdata" % int(mid)).attributes
    tsname, autos, _ = tileset_info(m['@tileset_id'])
    data = parse_table(m['@data'])
    evs = [(e.attributes['@x'], e.attributes['@y'], s(e.attributes['@name'])) for e in m['@events'].values()]
    render(data, tsname, autos, evs, grid=True).convert('RGB').save("render/map%03d.png" % int(mid))
    print(mid, data.shape, tsname)
