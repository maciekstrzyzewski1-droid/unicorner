# Bilanse z zajęć (rozwiązania w parach: zad. 2.16, 2.17, dodatkowe) — przeliczenie sum i wyniku netto.
def sp(*x): return sum(x)
def bil(nazwa, wnip, rat, ndl, idl, zap, nkr, ikr, rez, zdl, zkr, kap):
    A = sp(*wnip, *rat, *ndl, *idl) + sp(*zap, *nkr, *ikr)
    zob = sp(*rez, *zdl, *zkr); kw = A - zob; wn = kw - sum(kap)
    print(f"{nazwa}: aktywa trwałe {sp(*wnip,*rat,*ndl,*idl)}, obrotowe {sp(*zap,*nkr,*ikr)}, suma {A}, KW {kw}, wynik netto {wn}")
    return A, kw, wn
bil('2.16', [90000,55000], [240000,73000,200000,33000,340000], [], [66000], [18200,12400,4000,7100], [12000,200000,18900], [19500,24000], [36000], [], [190000,33000], [1500000,121000,-9000])
A,kw,_=bil('2.17 (bez KP)', [32000,18000], [1400000,410000,200000,325000,44000], [], [92000], [3700,8000], [39000,22000], [55000,2000], [8000,18000], [], [47000,17000], [600000,150000])
print('  KP = 31,39% KW =', round(kw*0.3139,2), '→ wynik netto', round(kw - round(kw*0.3139) - 750000))
bil('dodatkowe', [11000], [300000,450000,62000,400000,500000,24000,32000,90000], [], [15200], [13500,8000,2700,1000,30000,8400], [26300], [49000,50000,18000], [19000], [], [135000,10000,15000], [1800000,250000])
