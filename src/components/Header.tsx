import { useNav } from "../store/nav"
import { useAuthStore } from "../store/user"

export const Header = () => {

    const { airdropBalance, presaleBalance } = useAuthStore(state => state);

    const { isMobile, isSidebarOpen, setSidebarOpen } = useNav(state => state)
    const { mail, loading } = useAuthStore(state => state)

    const totalUHLD = (presaleBalance ?? 0) + (airdropBalance ?? 0);
    const totalUSD = totalUHLD / 100;

    return (
        <header style={{
            height: '60px', background: '#1e293b', /* borderBottom: '1px solid #ddd', */
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Кнопка бургера только на мобильных */}
                {isMobile && (
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ width: '2.5rem', height: '2rem', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px', color: 'white' }}>
                        {isSidebarOpen ? '×' : '☰'}
                    </button>
                )}
                <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#fff', cursor: 'pointer' }}>
                    <a href="https://www.youhold.online/">YouHold</a>
                    </div>
            </div>

            <div></div>



            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1rem', /* fontWeight: 'bold', */ color: 'rgb(127, 208, 90)' }}>{loading ? 'Loading...' : mail}</span>

                    <p
  style={{
    textAlign: 'center',
    color: 'white',
  }}
>
  <span style={{ color: 'lightgray' }}>Balance:</span>{' '}
  {loading
    ? 'loading...'
    : (
        <>
        <span style={{fontWeight:'bold'}}>
          {totalUHLD.toLocaleString('en', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}{' '}
          UHLD{' '}
          </span>
          <span style={{ color: 'lightgray', fontSize:'0.9rem' }}>
            (
            ~${totalUSD.toLocaleString('en', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            )
          </span>
        </>
      )}
</p>
                </div>


                {/* <div style={{ cursor: 'pointer', fontSize: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={'1.5rem'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                </div> */}
            </div>


        </header>
    )
}
