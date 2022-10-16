def tuple_product(list(t)):
    """
    Returns the product of the values in t.
    If t is neither a tuple nor an integer, it returns nothing.

    Extra credit: if the members of t are also tuples, it
    returns the product of the products of those tuples.
    """
    
    else:
        return(tuple_product(t[0])*tuple_product(t[1:]))

print(tuple_product((5, 6, 7)))