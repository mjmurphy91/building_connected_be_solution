# building_connected_be_solution
My solution to the Building Connected Backend Coding Challenge

The main part of my answer was the use of a heap in order to have quick 
sorting and instant retrieval of the next element to print.

Main bottleneck of my approach would be the lack of queued replacements. 
In a real-world setting, reading individual lines is not as ideal as a batch.
However, as the number of sources is changeable, a single synchronout pull 
from a used source was the most memory efficient and did not seem to have a
negative runtime impact.

For the asynchronous challenge, I used the same general idea as the synchronous,
but Promise objects necessitated changing from a simple loop to a recursive
solution.

Main bottleneck here was the inability to make any headway until the Promise
object completed its delay so it could be added to the heap.
