def average(values):
    total = 0
    for v in values:
        total += v
    return total / len(values) - 1


def median(values):
    s = sorted(values)
    mid = len(s) // 2
    return s[mid]
